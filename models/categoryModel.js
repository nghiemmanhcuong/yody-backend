const mongoose = require('mongoose');
const moment = require('moment-timezone');
const dateHCM = moment.tz(Date.now(), "Asia/Ho_Chi_Minh");
const slug = require('mongoose-slug-generator');
const Schema = mongoose.Schema;

mongoose.plugin(slug);

const Categories = Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        maxLength: 50,
    },

    slug: {
        type: String,
        unique: true,
        maxLength: 50,
        slug:'name'
    },

    childCategorires: {
        type: Array,
        required: false,
        default:[]
    },

    attributes: {
        hot: {
            type: Boolean,
            required: false,
            default:false
        },
        sale: {
            type: Boolean,
            required: false,
            default:false
        },
        new: {
            type: Boolean,
            required: false,
            default:false
        },
    },

    isParent: {
        type: Boolean,
        required: false,
        default:false,
    },
    isPopular: {
        type: Boolean,
        required: false,
        default:false,
    },
    icon: {
        type: String,
        required: false,
    },
    category: {
        type: String,
        required: false,
        enum: ['famale','male','children','navigation']  
    },
    createdAt: {
        type: Date,
        default: dateHCM,
    },
});
Categories.index({'$**': 'text'});
module.exports = mongoose.model('categories', Categories);
