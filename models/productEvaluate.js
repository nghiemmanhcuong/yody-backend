const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const moment = require('moment-timezone');
const dateHCM = moment.tz(Date.now(), "Asia/Ho_Chi_Minh");

const ProductEvaluates = Schema({
    productId: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
        maxLength: 255,
    },
    userEmail: {
        type: String,
        required: true,
        maxLength: 255,
    },
    userPhone: {
        type: String,
        required: false,
        maxLength: 15,
    },
    content: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: false,
    },
    stars: {
        type:Number,
        required: true,
        enum: [1, 2, 3, 4, 5]
    },
    createdAt: {
        type: Date,
        default: dateHCM,
    },
});

module.exports = mongoose.model('productEvaluates', ProductEvaluates);
