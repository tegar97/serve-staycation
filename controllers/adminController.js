const Category = require('../models/Category')
const Bank = require('../models/bank')
const Item = require('../models/item')
const image = require('../models/image')
const Feature = require('../models/feature')
const Activity = require('../models/Activity')
const Users =require('../models/Users')
const Booking = require('../models/booking')
const Member = require('../models/member')
const fs = require('fs-extra')
const path = require('path')
const bcrypt = require('bcryptjs')
module.exports = 
{
    viewLogin : (req,res) => {
        
        try {
            

            const alertMessage = req.flash('alertMessage')
            const alertStatus = req.flash('alertStatus')
            const alert = {message: alertMessage,status: alertStatus}
            if(req.session.user == null || req.session.user == undefined) {
                res.render('index',{alert,title: "StayCation | Login"})
            }else{
                res.redirect('/admin/dasboard')
            }
            

           
        } catch (error) {
            res.redirect('/admin/signin')
        
        }
      

    },
    
    actionSignin  : async(req,res) =>{
        try {
            const {username,password} = req.body;
            const user = await Users.findOne({username : username})
            if(!user) {
                req.flash('alertMessage','Username Tidak Ditemukan')
                req.flash('alertStatus','danger')
                res.redirect('/admin/signin')
            }
            const isPasswordMatch = await bcrypt.compare(password,user.password)
            if(!isPasswordMatch) {
                req.flash('alertMessage','password Anda Masukan Salah !!')
                req.flash('alertStatus','danger')
                res.redirect('/admin/signin')
            }

            req.session.user = {
                id : user.id,
                username : user.username
            }
            res.redirect('/admin/dasboard')
     
        } catch (error) {
            res.redirect('/admin/signin')
        }


    },
    actionLogout: async(req,res) =>{
        req.session.destroy();
        res.redirect('/admin/signin')
    },
    viewDasboard : async(req,res) =>{
        const member = await Member.find()
        const booking = await Booking.find()
        const item = await Item.find()
        res.render('admin/dasboard/view_dasboard',{member,booking,item,title: "StayCation | Dasboard",user: req.session.user})
    },

    viewCategory : async(req,res) =>{

        try {
            const category = await Category.find()
            const alertMessage = req.flash('alertMessage')
            const alertStatus = req.flash('alertStatus')
            const alert = {message: alertMessage,status: alertStatus}
            

            res.render('admin/category/view_category',{ category ,alert,title: "StayCation | Category",user: req.session.user});
        } catch (error) {
            res.redirect('/admin/category')
        
        }
        
    },
    addCategory :  async(req,res) => {

        try {
            const {name } =  req.body;
            await Category.create({name})
            req.flash('alertMessage','sukses add category')
            req.flash('alertStatus','success')
            
            res.redirect('/admin/category')
            
        } catch (error) {
            req.flash('alertMessage',`${error.message} `)
            req.flash('alertStatus','danger')
            res.redirect('/admin/category')
        }
        

    },
    editCategory : async (req,res) =>{
        try {
        
            const { id,name } = req.body;
        
            const category = await Category.findOne({_id: id})
            category.name = name
            await category.save()
            req.flash('alertMessage','sukses update category')
            req.flash('alertStatus','success')
            res.redirect('/admin/category')
        } catch (error) {
            req.flash('alertMessage',`${error.message} `)
            req.flash('alertStatus','danger')
            res.redirect('/admin/category')
        }
        
    },
    deleteCategory :  async(req,res) => {
        try {
            const category =  await Category.findByIdAndDelete(req.params.id)
            req.flash('alertMessage','sukses delete category')
            req.flash('alertStatus','success')
            res.redirect('/admin/category')
        } catch (error) {
            req.flash('alertMessage',`${error.message} `)
            req.flash('alertStatus','danger')
            res.redirect('/admin/category')
        }
      
        
    

    },

    viewBank : async(req,res) =>{
        const bank = await Bank.find()
        const alertMessage = req.flash('alertMessage')
        const alertStatus = req.flash('alertStatus')
        const alert = {message: alertMessage,status: alertStatus}
        res.render('admin/bank/view_bank',{bank,alert,title: "StayCation | Bank",user: req.session.user})
    },
    addBank : async(req,res) =>{
        try {
            const {name,nameBank,nomerRekening} = req.body;
      
            await Bank.create({
                name,
                nameBank,
                nomerRekening,
                imageUrl : `images/${req.file.filename}`
            }) 
            req.flash('alertMessage','sukses add bank')
            req.flash('alertStatus','success')
            res.redirect('/admin/bank')
        } catch (error) {
            req.flash('alertMessage',`${error.message} `)
            req.flash('alertStatus','danger')
            res.redirect('/admin/bank')
        }

        
    },

    editBank : async(req,res) => {
        try {
            
            const {id,name,nameBank,nomerRekening} = req.body
            const bank = await Bank.findOne({_id : id})
            if(req.file == undefined) {
                bank.name = name;
                bank.nameBank = nameBank;
                bank.nomerRekening = nomerRekening
                await bank.save()
                req.flash('alertMessage','sukses add bank')
                req.flash('alertStatus','success')
                res.redirect('/admin/bank')
            }else{
                await fs.unlink(path.join(`public/${bank.imageUrl}`))
    
                bank.name = name
                bank.nameBank = nameBank;
                bank.nomerRekening = nomerRekening
                bank.imageUrl = `images/${req.file.filename}`
                await bank.save()
                req.flash('alertMessage','sukses add bank')
                req.flash('alertStatus','success')
                res.redirect('/admin/bank')
            }
        } catch (error) {
            req.flash('alertMessage',`${error.message} `)
            req.flash('alertStatus','danger')
            res.redirect('/admin/bank')
            
        }
    },
        deleteBank : async(req,res) =>{
            try {
                const {id} = req.params
                const bank = await Bank.findOne( {_id: id} );
                await fs.unlink(path.join(`public/${bank.imageUrl}`))
                await bank.remove()
                req.flash('alertMessage','sukses delete bank')
                req.flash('alertStatus','success')
                res.redirect('/admin/bank')

                
            } catch (error) {
                req.flash('alertMessage',`${error.message} `)
                req.flash('alertStatus','danger')
                res.redirect('/admin/bank')
            }
        

        
    },

    viewItem : async(req,res) =>{
        try {
            const item = await Item.find()
                    .populate({path : 'imageId',select:'id imageUrl'})
                     .populate({path : 'categoryId',select:'id name'})
             
            const category = await Category.find()
            const alertMessage = req.flash('alertMessage')
            const alertStatus = req.flash('alertStatus')
            const alert = {message: alertMessage,status: alertStatus}
            
            res.render('admin/Item/view_item',{category,item,alert,title: "StayCation | item",action: 'view',user: req.session.user})
        } catch (error) {
            console.log(error)
            req.flash('alertMessage',`${error.message} `)
            req.flash('alertStatus','danger')
            res.redirect('/admin/item')
        }
    
    },
    addItem : async(req,res) =>{
        try {
            const {categoryId,title,price,city,about } = req.body
            if(req.files.length > 0) {
                const category = await Category.findOne({_id:categoryId})
                const newItem = {
                    categoryId : category._id,
                    title,
                    description : about,
                    price,
                    city
                }
                const item = await Item.create(newItem)
                category.itemId.push({_id: item._id})
                await category.save()
                for(let i  = 0; i < req.files.length; i++){
                    const imageSave = await image.create({imageUrl: `images/${req.files[i].filename}` })
                    item.imageId.push({_id: imageSave._id})
                    await item.save()
                }
                req.flash('alertMessage','sukses add item')
                req.flash('alertStatus','success')
                res.redirect('/admin/item')


            }
        } catch (error) {
            console.log(error)
            req.flash('alertMessage',`${error.message} `)
            req.flash('alertStatus','danger')
            res.redirect('/admin/item')
        }

    },

    showImageItem : async (req,res ) => {
        try {
            const {id} = req.params
            const item = await Item.findOne({_id : id})
                    .populate({path : 'imageId',select:'id imageUrl'})
                  
             
    
            const alertMessage = req.flash('alertMessage')
            const alertStatus = req.flash('alertStatus')
            const alert = {message: alertMessage,status: alertStatus}
            
            res.render('admin/Item/view_item',{item,alert,title: "StayCation | Show Image Item",action : 'Show Image',user: req.session.user })

        } catch (error) {
            req.flash('alertMessage',`${error.message} `)
            req.flash('alertStatus','danger')
            res.redirect('/admin/item')
        }
    },

    showEditItem : async (req,res ) => {
        try {
            const {id} = req.params

            const item = await Item.findOne({_id : id})
                    .populate({path : 'imageId',select:'id imageUrl'})     
                    .populate({path : 'categoryId',select:'id name'})     
             
            const category = await Category.find()
            const alertMessage = req.flash('alertMessage')
            const alertStatus = req.flash('alertStatus')
            const alert = {message: alertMessage,status: alertStatus}
            
            res.render('admin/Item/view_item',{category,item,alert,title: "StayCation | Edit Item",action : 'edit item',user: req.session.user })

        } catch (error) {
            
        }
    },
    editItem : async(req,res) => {
        try {
            const {id} = req.params
            const {categoryId,title,price,city,about } = req.body
            const item = await Item.findOne({_id : id})
            .populate({path : 'imageId',select:'id imageUrl'})     
            .populate({path : 'categoryId',select:'id name'})     

            if(req.files.length > 0) {
                for(let i = 0; i< item.imageId.length; i++){
                    const imageUpdate = await image.findOne({_id: item.imageId[i]._id})
                    await fs.unlink(path.join(`public/${imageUpdate.imageUrl}`))
                    imageUpdate.imageUrl = `images/${req.files[i].filename}`
                    await imageUpdate.save()
                    item.title = title;
                    item.price = price;
                    item.city = city;
                    item.description = about;
                    item.categoryId = categoryId
                    await item.save()
                    req.flash('alertMessage','sukses add item')
                    req.flash('alertStatus','success')
                    res.redirect('/admin/item')
                }

            }else{
                item.title = title;
                item.price = price;
                item.city = city;
                item.description = about;
                item.categoryId = categoryId
                await item.save()
                req.flash('alertMessage','sukses add item')
                req.flash('alertStatus','success')
                res.redirect('/admin/item')
            }
        } catch (error) {
        
            req.flash('alertMessage',`${error.message} `)
            req.flash('alertStatus','danger')
            res.redirect('/admin/item')
        }

    },
    deleteItem : async (req,res) => {
        try {
            const {id} = req.params
            const item = await Item.findOne({_id : id})
            .populate('imageId')     
            for(let i = 0 ; i < item.imageId.length; i++){
                image.findOne({_id : item.imageId[i]._id}).then((image)=> {
                     fs.unlink(path.join(`public/${image.imageUrl}`))
                    image.remove()
                }).catch((error) =>{
                    console.log(error)
                    req.flash('alertMessage',`${error.message} `)
                    req.flash('alertStatus','danger')
                    res.redirect('/admin/item')
                }) 

            }
            await item.remove()
            req.flash('alertMessage','sukses delete item')
            req.flash('alertStatus','success')
            res.redirect('/admin/item')
          
        
        } catch (error) {
            req.flash('alertMessage',`${error.message} `)
            req.flash('alertStatus','danger')
            res.redirect('/admin/item')
        }
    },
    viewDetailItem: async (req,res) => {
        const {itemId} = req.params;
        try {
            const alertMessage = req.flash('alertMessage')
            const alertStatus = req.flash('alertStatus')
            const alert = {message: alertMessage,status: alertStatus}
            const feature = await Feature.find({itemId: itemId})
            const activity = await Activity.find({itemId: itemId})
         
            res.render('admin/item/detail_item/view_detail_item',{
                title : 'Staycation | Detail Item',
                alert,
                itemId,
                feature,
                activity,
                user: req.session.user
            })
            
        }catch(error) {
            req.flash('alertMessage',`${error.message} `)
            req.flash('alertStatus','danger')
            res.redirect(`/admin/item/show-detail-item/${itemId}`)
        }

    },
    addFeature: async (req,res) =>{
        try {
            const {name,qty,itemId} = req.body;
            
            if(!req.file) {
                req.flash('alertMessage','sukses ADD feature')
                req.flash('alertStatus','danger')
                res.redirect(`/admin/item/show-detail-item/${itemId}`)
            }
            const feature = await Feature.create({
                name,
                qty,
                itemId,
                imageUrl: `images/${req.file.filename}`
            });
            const item = await Item.findOne({_id: itemId})
            item.featureId.push({_id:feature._id})
            await item.save()
            req.flash('alertMessage','sukses ADD feature')
            req.flash('alertStatus','success')
            res.redirect(`/admin/item/show-detail-item/${itemId}`)
        } catch (error) {

            req.flash('alertMessage',`${error.message} `)
            req.flash('alertStatus','danger')
            res.redirect(`/admin/item/show-detail-item/${itemId}`)
        }
    },
    editFeature : async(req,res) => {
        const {id,name,qty,itemId} = req.body
        try {
            
          
            const feature = await Feature.findOne({_id : id})
            if(req.file == undefined) {
                feature.name = name;
                feature.qty = qty;
                await feature.save()
                req.flash('alertMessage','sukses edit feature')
                req.flash('alertStatus','success')
                res.redirect(`/admin/item/show-detail-item/${itemId}`)
               
            }else{
                await fs.unlink(path.join(`public/${feature.imageUrl}`))
    
                feature.name = name
                feature.qty = qty;
                feature.imageUrl = `images/${req.file.filename}`
                await feature.save()
                req.flash('alertMessage','sukses edit feature')
                req.flash('alertStatus','success')
                res.redirect(`/admin/item/show-detail-item/${itemId}`)
            }
        } catch (error) {
            req.flash('alertMessage',`${error.message} `)
            req.flash('alertStatus','danger')
            res.redirect(`/admin/item/show-detail-item/${itemId}`)
            
        }
    },
    deleteFeature : async(req,res) =>{
        const {id , itemId} = req.params
        try {
       
            const feature = await Feature.findOne( {_id: id} );

            const item = await Item.findOne({_id: itemId }).populate('featureId')
            console.log(item)
            for(let i = 0 ; i < item.featureId.length; i++){
                if(item.featureId[i]._id.toString() === feature._id.toString()) {
                    item.featureId.pull({_id: feature._id});
                    await item.save()
                }
            }
            await fs.unlink(path.join(`public/${feature.imageUrl}`))
            await feature.remove()
            req.flash('alertMessage','sukses hapus feature')
            req.flash('alertStatus','success')
            res.redirect(`/admin/item/show-detail-item/${itemId}`)
          

            
        } catch (error) {
            console.log(error)
            req.flash('alertMessage',`${error.message} `)
            req.flash('alertStatus','danger')
            res.redirect(`/admin/item/show-detail-item/${itemId}`)
            
        }
    

    
},
    addActivity: async (req,res) =>{
        const {name,type,itemId} = req.body;
        try {
           
            
            if(!req.file) {
                req.flash('alertMessage','sukses ADD feature')
                req.flash('alertStatus','danger')
                res.redirect(`/admin/item/show-detail-item/${itemId}`)
            }
            const activity = await Activity.create({
                name,
                type,
                itemId,
                imageUrl: `images/${req.file.filename}`
            });
            const item = await Item.findOne({_id: itemId})
            console.log(item.populate('activityId'))
            item.activityId.push({ _id: activity._id })
            await item.save()
            req.flash('alertMessage','sukses ADD activity')
            req.flash('alertStatus','success')
            res.redirect(`/admin/item/show-detail-item/${itemId}`)
        } catch (error) {

            req.flash('alertMessage',`${error.message} `)
            req.flash('alertStatus','danger')
            res.redirect(`/admin/i\tem/show-detail-item/${itemId}`)
        }
    },
    editActivity : async(req,res) => {
        const {id,name,type,itemId} = req.body
        try {
            
          
            const activity = await Activity.findOne({_id : id})
            if(req.file == undefined) {
                activity.name = name;
                activity.type = type;
                await activity.save()
                req.flash('alertMessage','sukses edit Activity')
                req.flash('alertStatus','success')
                res.redirect(`/admin/item/show-detail-item/${itemId}`)
               
            }else{
                await fs.unlink(path.join(`public/${activity.imageUrl}`))
    
                activity.name = name
                activity.type = type;
                activity.imageUrl = `images/${req.file.filename}`
                await activity.save()
                req.flash('alertMessage','sukses edit Activity')
                req.flash('alertStatus','success')
                res.redirect(`/admin/item/show-detail-item/${itemId}`)
            }
        } catch (error) {
            req.flash('alertMessage',`${error.message} `)
            req.flash('alertStatus','danger')
            res.redirect(`/admin/item/show-detail-item/${itemId}`)
            
        }
    },
       editFeature : async(req,res) => {
        const {id,name,qty,itemId} = req.body
        try {
            
          
            const feature = await Feature.findOne({_id : id})
            if(req.file == undefined) {
                feature.name = name;
                feature.qty = qty;
                await feature.save()
                req.flash('alertMessage','sukses edit feature')
                req.flash('alertStatus','success')
                res.redirect(`/admin/item/show-detail-item/${itemId}`)
               
            }else{
                await fs.unlink(path.join(`public/${feature.imageUrl}`))
    
                feature.name = name
                feature.qty = qty;
                feature.imageUrl = `images/${req.file.filename}`
                await feature.save()
                req.flash('alertMessage','sukses edit feature')
                req.flash('alertStatus','success')
                res.redirect(`/admin/item/show-detail-item/${itemId}`)
            }
        } catch (error) {
            req.flash('alertMessage',`${error.message} `)
            req.flash('alertStatus','danger')
            res.redirect(`/admin/item/show-detail-item/${itemId}`)
            
        }
    },
    deleteActivity : async(req,res) =>{
        const {id , itemId} = req.params
        try {
       
            const activity = await Activity.findOne( {_id: id} );

            const item = await Item.findOne({_id: itemId }).populate('activityId')
    
            for(let i = 0 ; i < item.activityId.length; i++){
                if(item.activityId[i]._id.toString() === activity._id.toString()) {
                    item.activityId.pull({_id: activity._id});
                    await item.save()
                }
            }
            await fs.unlink(path.join(`public/${activity.imageUrl}`))
            await activity.remove()
            req.flash('alertMessage','sukses hapus activity')
            req.flash('alertStatus','success')
            res.redirect(`/admin/item/show-detail-item/${itemId}`)
          

            
        } catch (error) {
            console.log(error)
            req.flash('alertMessage',`${error.message} `)
            req.flash('alertStatus','danger')
            res.redirect(`/admin/item/show-detail-item/${itemId}`)
            
        }
    

    
},



    viewbooking : async(req,res) =>{

        try {
            const booking = await Booking.find()
              .populate('memberId')
              .populate('bankId')
         


      
        res.render('admin/booking/view_booking',{title: "StayCation | booking",user : req.session.user,booking})
            
        } catch (error) {
            res.redirect('/admin/booking')
        }
        
    },
    viewbooking : async(req,res) =>{
        try {
            
            const booking = await Booking.find()
                  .populate('memberId')
                 
             
    
    
          
            res.render('admin/booking/view_booking',{title: "StayCation | booking",user : req.session.user,booking})
        } catch (error) {
            console.log(error)
            
        }
    },
    showDetailBooking : async(req,res) => {
        const {id} = req.params
        try {
            const booking = await Booking.findOne({_id:id})
            .populate('memberId')
         
            const alertMessage = req.flash('alertMessage')
            const alertStatus = req.flash('alertStatus')
            const alert = {message: alertMessage,status: alertStatus}
            
            res.render('admin/booking/show_detail_booking',{alert,title: "StayCation | booking",user : req.session.user,booking})
        } catch (error) {
            console.log(error)
            res.redirect('admin/booking')
            
        }
      

    },
    actionConfirmation  : async(req,res) => {
        const {id} = req.params
        try {
            const booking = await Booking.findOne({_id : id})
        booking.payments.status = 'Accept'
        await booking.save()
        req.flash('alertMessage','Berhasil Confirmasi Pembayaran')
        req.flash('alertStatus','success')
        res.redirect(`/admin/booking/${id}`)
        } catch (error) {
            req.flash('alertMessage',`${error.message} `)
            req.flash('alertStatus','danger')
            res.redirect(`/admin/bank/${id}`)
        }
    
    },
    actionReject  : async(req,res) => {
        const {id} = req.params
        try {
            const booking = await Booking.findOne({_id : id})
        booking.payments.status = 'Reject'
        await booking.save()
        req.flash('alertMessage','Berhasil Reject Pembayaran')
        req.flash('alertStatus','success')
        res.redirect(`/admin/booking/${id}`)
        } catch (error) {
            req.flash('alertMessage',`${error.message} `)
            req.flash('alertStatus','danger')
            res.redirect(`/admin/bank/${id}`)
        }
    
    }
    

   
}