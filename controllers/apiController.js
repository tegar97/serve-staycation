const Category = require('../models/Category')
const Bank = require('../models/bank')
const Item = require('../models/item')
const image = require('../models/image')
const Feature = require('../models/feature')
const Tresure = require('../models/Activity')
const Users =require('../models/Users')
const Traveler = require('../models/booking')
const Member = require('../models/member')
const fs = require('fs-extra')
const path = require('path')
const bcrypt = require('bcryptjs')
module.exports = 
{
    landing_page : async(req,res) =>{

        try {
            const mostPicked = await Item.find()
                                         .select('_id country title price imageId city')
                                         .limit(5)
                                         .populate('imageId')

             const category = await Category.find() 
                                            .select('_id name')
                                            .limit(3)
                                            .populate({
                                                path : 'itemId',
                                                select : '_id title country city isPopular imageId ',
                                                perDocumentLimit : 4,
                                                option : {sort : {sumBooking : -1}},
                                                populate: {path: 'imageId',select : '_id imageUrl'}

                                            })
            const testimonial = {
                "_id": "asd1293uasdads1",
                "imageUrl": "/images/testimonial-landingpages.jpg",
                "name": "Happy Family",
                "rate": 4.55,
                "content": "What a great trip with my family and I should try again next time soon ...",
                "familyName": "Angga",
                "familyOccupation": "Product Designer"
            }
                                          
            const treasure = await Tresure.find()
            const city = await  Item.find()
            const travel = await  Traveler.find()

            for(let i = 0; i < category.length; i++) {
                for(let x = 0; x < category[i].itemId.length; x++){
                    const item = await Item.findOne({_id : category[i].itemId[x]._id})
                    item.isPopular = false;
                    await  item.save()
                    if(category[i].itemId[0] === category[i].itemId[x]  ) {
                        item.isPopular = true
                        await item.save()
                    }
                }
            }



            res.status(200).json({
                status: 'success',
                hero : {
                    treasure : treasure.length,
                    traveler : travel.length,
                    cities : city.length

                },
              mostPicked,
              category,
              testimonial
            })
        } catch (error) {
            res.status(400).json({
                status: 'fail',
                message : error
                
            })
        }
    },
    detailPage : async (req,res) => {
        try {
            const {id} = req.params;
            const item  = await Item.findOne({_id : id})
                                    .populate({path : 'featureId',select: '_id name qty imageUrl'})
                                    .populate({path : 'activityId',select: '_id name type imageUrl'})
                                    .populate({path : 'imageId',select: '_id imageUrl'})
            const bank = await Bank.find()
            const testimonial = {
                "_id": "asd1293uasdads1",
                "imageUrl": "/images/testimonial-landingpages.jpg",
                "name": "Happy Family",
                "rate": 4.55,
                "content": "What a great trip with my family and I should try again next time soon ...",
                "familyName": "Angga",
                "familyOccupation": "Product Designer"
            }
            res.status(200).json({
                status : 'success',
                item,
                bank,
                testimonial
            })
        } catch (err) {
            console.log(err)
            res.status(400).json({
              

                status: 'fail',
                message : err
                
            })
        }
    },
    bookingPage : async (req,res) => {
        const {
            idItem,
            duration,
            // price,
            bookingStartDate,
            bookingEndDate,
            firstName,
            lastName,
            email,
            phoneNumber,
            accountHolder,
            bankFrom
        } = req.body 
        console.log(   
            idItem,
            duration,
            // price,
            bookingStartDate,
            bookingEndDate,
            firstName,
            lastName,
            email,
            phoneNumber,
            accountHolder,
            bankFrom
        )

        if(!req.file) {
            return res.status(404).json({message : "Image Not Found"})
        }
        const item = await Item.findOne({_id :idItem})
        if(
            idItem === undefined || 
            duration === undefined ||
            // price === undefined ||
            bookingStartDate === undefined ||
            bookingEndDate === undefined ||
            firstName === undefined ||
            lastName === undefined ||
            email === undefined ||
            phoneNumber === undefined ||
            accountHolder === undefined ||
            bankFrom === undefined
        ){
            return res.status(404).json({message : "Lengkaspi Semua Field"})
        }

        item.sumBooking += 1;
        await item.save()

        let total = item.price * duration
        let tax = total * 0.10 

        const invoice = Math.floor(1000000 * Math.random() * 9000000)

        const member = await Member.create({
            firstName,
            lastName,
            email,
            phoneNumber
            
        })
        const newBooking =  {
            invoice,
            bookingStartDate,
            bookingEndDate,
            total : total += tax,
            itemId : {
                _id : item.id,
                title : item.title,
                price: item.price,
                duration : duration

            },
            memberId : member.id,
            payments : {
                proofPayment : `images/${req.file.filename}`,
                bankFrom : bankFrom,
                accountHolder : accountHolder


            }
        }
        const booking = await Traveler.create(newBooking)


        return res.status(201).json({message : "Success Booking"})


    }
}
