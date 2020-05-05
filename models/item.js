const mongoose = require("mongoose")
const {ObjectId} = mongoose.Schema

const itemSchema = new mongoose.Schema({
    title : {
        type: String,
        required: true
    },
    price : {
        type: Number,
        required: true
    },
    country : {
        type: String,
        default : 'Indonesia'
    },
    city : {
        type: String,
        required: true
    },
    unit : {
        type: String,
        default : 'night'
    },
    sumBooking  :{
        type : Number,
        default :0
    },
    isPopular : {
        type: Boolean
    },
    description : {
        type: String,
        required: true
    },
    categoryId : {
        type: ObjectId,
        ref : 'Category'

    },
    imageId : [{
        type: ObjectId,
        ref: 'image'
    }],
    featureId : [{
        type: ObjectId,
        ref: 'feature'
    }],
    activityId : [{
        type: ObjectId,
        ref: 'Activity'
    }],
    
    
})

module.exports = mongoose.model('Item',itemSchema)