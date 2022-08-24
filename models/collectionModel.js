const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const Schema = mongoose.Schema;

mongoose.plugin(slug);

const Collections = Schema({
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

    image: {
        type: String,
        required: true,
        maxLength: 500,
    },
});

module.exports = mongoose.model('collections', Collections);
