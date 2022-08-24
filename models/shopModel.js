const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shops = Schema({
    province: {
        type:String,
        required:true,
    },
    shopName: {
        type:String,
        required:true,
    },
    address: {
        type:String,
        required:true,
    },
    phone: {
        type:String,
        required:true,
    },
    linkMap: {
        type:String,
        required:true,
    }
});

shops.index({'$**': 'text'});
module.exports = mongoose.model('shops', shops);
