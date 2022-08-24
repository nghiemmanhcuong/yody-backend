const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const infos = Schema({
    companyName: {
        type:String,
        required:true
    },
    address: {
        type:String,
        required:true
    },
    hotline: {
        type:String,
        required:true,
        maxLength:20
    },
    phoneOrder: {
        type:String,
        required:true,
        maxLength:20
    },
    phoneWonder: {
        type:String,
        required:true,
        maxLength:20
    },
    phoneFeedback: {
        type:String,
        required:true,
        maxLength:20
    },
    mailCustomerCare: {
        type:String,
        required:true,
    },
    slogan: {
        type:String,
        required:true,
    }
});

module.exports = mongoose.model('infos', infos);
