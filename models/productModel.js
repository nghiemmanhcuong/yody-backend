const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const moment = require('moment-timezone');
const dateHCM = moment.tz(Date.now(), "Asia/Ho_Chi_Minh");
const Schema = mongoose.Schema;

mongoose.plugin(slug);

const Products = Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            maxLength: 255,
        },
        image_main: {
            type: String,
            required: true,
        },
        images: {
            type: Array,
            required: true,
        },
        material: {
            type:String,
            required: false,
            ref: 'materials',
        },
        categoryId: {
            type: String,
            required: true,
            ref: 'categories',
        },
        collectionId: {
            type: String,
            required: false,
            ref: 'collections',
            default:null,
        },
        price: {
            real_price: {
                type: Number,
                required: true,
            },
            sale_price: {
                type: Number,
                required: false,
                default: 0,
            },
            sale_number: {
                type: Number,
                required: false,
                default: 0,
            },
        },
        description: {
            type: String,
            required: false,
            default: 'Chưa có mô tả cho sản phẩm này!',
        },
        detail: {
            type: String,
            required: true,
        },
        warehouse: {
            colors: {
                type: Array,
                required: true,
                default: []
            },
            sizes: {
                type: Array,
                required: true,
                default: []
            },
        },
        seo: {
            title: {
                type: String,
                required: false,
            },
            metaKeyword: {
                type: String,
                required: false,
            },
            metaDescription: {
                type: String,
                required: false,
            }
        },
        slug: {
            type: String,
            unique: true,
            maxLength: 255,
            slug: 'name',
        },
        views: {
            type: Number,
            required: false,
            default: 0,
        },
        sold: {
            type: Number,
            required: false,
            default: 0,
        },
        isPopular: {
            type: Boolean,
            required: false,
            default: false,
        },
        createdAt: {
            type: Date,
            default: dateHCM,
        },
    },
    {timestamp: true},
);

Products.index({'$**': 'text'});
module.exports = mongoose.model('products', Products);
