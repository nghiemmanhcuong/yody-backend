const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const Schema = mongoose.Schema;

mongoose.plugin(slug);

const banners = Schema({
    image: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    width: {
        type: Number,
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    isSliderHero: {
        type: Boolean,
        required: false,
        default: false,
    },
    isSliderBot: {
        type: Boolean,
        required: false,
        default: false,
    },
    isPopular: {
        type: Boolean,
        required: false,
        default: false,
    },
    isTopbar: {
        type: Boolean,
        required: false,
        default: false,
    },
    isHot: {
        type: Boolean,
        required: false,
        default: false,
    },
});

module.exports = mongoose.model('banners', banners);
