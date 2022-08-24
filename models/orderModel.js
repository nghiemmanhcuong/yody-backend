const mongoose = require('mongoose');
const moment = require('moment-timezone');
const dateHCM = moment.tz(Date.now(), "Asia/Ho_Chi_Minh");

const Schema = mongoose.Schema;

const Orders = Schema(
    {
        name: {
            type: String,
            required: true,
            maxLength: 50,
        },
        userId: {
            type: String,
            required: false,
        },
        phone: {
            type: String,
            required: true,
            maxLength: 11,
        },
        address: {
            type: String,
            required: true,
        },
        province: {
            type: String,
            required: true,
        },
        district: {
            type: String,
            required: true,
        },
        wards: {
            type: String,
            required: true,
        },
        noteMessage: {
            type: String,
            maxLength: 500,
            default: 'Không có ghi chú',
        },
        paymentMethod: {
            type: String,
            required: true,
        },
        products: {
            type: Array,
            required: true,
        },
        totalPrice:{
            type: Number,
            required: true,
        },
        status: {
            payment: {
                type: String,
                required: true,
                default: 'Chưa thanh toán',
                enum: ['Chưa thanh toán', 'Đã thanh toán'],
            },
            transport: {
                type: String,
                required: true,
                default: 'Chờ xác nhận',
                enum: ['Chờ xác nhận', 'Đang vận chuyển', 'Đã nhận hàng'],
            },
        },
        createdAt: {
            type: Date,
            default: dateHCM,
        },
    },
    {timestamp: true},
);

module.exports = mongoose.model('orders', Orders);
