const mongoose = require('mongoose');
const moment = require('moment-timezone');
const dateHCM = moment.tz(Date.now(), "Asia/Ho_Chi_Minh");
const Schema = mongoose.Schema;

const Users = Schema(
    {
        name: {
            type: String,
            required: true,
            maxLength: 25,
        },
        surname: {
            type: String,
            required: true,
            maxLength: 50,
        },
        phone: {
            type: String,
            required: true,
            maxLength: 11,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            maxLength: 255,
        },
        password: {
            type: String,
            required: true,
            maxLength: 255,
        },
        interests: {
            type: String,
            required: false,
            maxLength: 100,
        },
        addresses: {
            type: Array,
            required: false,
            default: [],
        },
        favorite_products: {
            type: Array,
            required: false,
            default: [],
        },
        access: {
            type: String,
            required: false,
            enum: ['user', 'saff', 'admin'],
            default: 'user'
        },
        createdAt: {
            type: Date,
            default: dateHCM,
        },
    }
);
Users.index({'$**': 'text'});
module.exports = mongoose.model('users', Users);

