const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const moment = require('moment-timezone');
const dateHCM = moment.tz(Date.now(), "Asia/Ho_Chi_Minh");
const Schema = mongoose.Schema;

mongoose.plugin(slug);

const Blogs = Schema(
    {
        title: {
            type: String,
            required: true,
            maxLength: 500,
        },
        description: {
            type: String,
            required: true,
            maxLength: 1000,
        },
        content: {
            type: String,
            required: true,
        },
        blog_category: {
            type: String,
            required: true,
            ref:'blogCategories'
        },
        image: {
            type: String,
            required: true,
        },
        author: {
            type: String,
            required: true,
            maxLength: 100,
        },
        slug: {
            type: String,
            slug: 'title',
            maxLength: 255,
        },
        views: {
            type:Number,
            required: false,
            default:0
        },
        comments: {
            type: Array,
            required: false,
            default:[]
        },
        isPopular: {
            type: Boolean,
            required: false,
            default:false
        },
        createdAt: {
            type: Date,
            default: dateHCM,
        },
    },
    {timestamp: true},
);

module.exports = mongoose.model('blogs', Blogs);