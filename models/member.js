const monngoose = require("mongoose")

const bankSchema = new monngoose.Schema({
    firstName : {
        type: String,
        required: true
    },
    lastName : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },
    phoneNumber : {
        type: String,
        required: true
    },
    
})

module.exports = monngoose.model('Member',bankSchema)