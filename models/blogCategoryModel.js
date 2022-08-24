const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const Schema = mongoose.Schema;

mongoose.plugin(slug);

const BlogCategories = Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        maxLength: 50,
    },

    isParent: {
        type: Boolean,
        required: false,
        default: false,
    },

    childCategorires: {
        type: Array,
        required: false,
        default:[]
    },

    slug: {
        type: String,
        unique: true,
        maxLength: 50,
        slug:'name'
    },
});

BlogCategories.index({'$**': 'text'});
module.exports = mongoose.model('blogCategories', BlogCategories);
