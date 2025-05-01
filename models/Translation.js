const mongoose = require('mongoose');

const translationSchema = new mongoose.Schema({
    key: { 
        type: String, 
        required: true 
    },
    language: { 
        type: String, 
        required: true 
    },
    value: { 
        type: String, 
        required: true 
    },
    project: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Project', 
        required: true 
    },
});

module.exports = mongoose.model('Translation', translationSchema);