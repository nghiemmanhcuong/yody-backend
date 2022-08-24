const mongoose = require('mongoose');
const moment = require('moment-timezone');
const dateHCM = moment.tz(Date.now(), "Asia/Ho_Chi_Minh");
const Schema = mongoose.Schema;

const Contacts = Schema(
    {
        name: {
            type: String,
            required: true,
            maxLength: 255,
        },
        email: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: dateHCM,
        },
    },
    {timestamps: true},
);

module.exports = mongoose.model('contacts', Contacts);
