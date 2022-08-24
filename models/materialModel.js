const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const materials = Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        maxLength: 100,
    },
});

module.exports = mongoose.model('materials', materials);
