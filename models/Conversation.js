const mongoose = require('mongoose');

const conversationSchema = mongoose.Schema({
    member: {
        type: Array,
        required: true
    }
})

module.exports = mongoose.model('Conversation', conversationSchema);