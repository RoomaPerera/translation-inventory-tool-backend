const mongoose = require('mongoose');

const languageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true,
    }
});

module.exports = mongoose.model('Language', languageSchema);