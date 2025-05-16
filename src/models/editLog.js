const mongoose = require('mongoose');

const editLogSchema = new mongoose.Schema({
    translation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Translation',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        enum: ['join', 'leave', 'edit'],
        required: true
    },
    payload: {
        type: mongoose.Schema.Types.Mixed
    },
    timeStamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('editLog', editLogSchema)