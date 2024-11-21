const expressAsyncHandler = require('express-async-handler');
const Conversation = require('../models/Conversation');
const Users = require('../models/User')
const Messages = require('../models/Message')

const createConversation = expressAsyncHandler(async (req, res) => {
    const { senderId, reciverId } = req.body;

    const nerConversation = new Conversation({ member: [senderId, reciverId] });

    await nerConversation.save();

    res.json({ messages: 'Conversation created succesfully' });

})

const getConverstation = expressAsyncHandler(async (req, res) => {
    const userId = req.params.userId;
    const conversations = await Conversation.find({ member: { $in: [userId] } });

    const userConversation = Promise.all(conversations.map(async (conversation) => {
        const reciverId = conversation.member.find((member) => member !== userId);
        const user = await Users.findById(reciverId);
        return { user: { name: user.username, email: user.email }, conversationId: conversation._id }
    }))
    const user = await userConversation
    res.send(user)
});

// send message
const postMessage = expressAsyncHandler(async (req, res) => {
    const { conversationId, senderId, message, reciverId = '' } = req.body;
    if (!senderId || !message) return res.status(400).send('all fields required');
    else if (!conversationId && reciverId) {
        const newConversation = new Conversation({member: [senderId, reciverId]});
        await newConversation.save();
        const newMessage = new Messages({conversationId: newConversation._id, senderId, message});
        await newMessage.save();
        return res.send('Message sent successfully');
    }
    const newMessage = new Messages({ conversationId, senderId, message });
    await newMessage.save();
    res.send('message send successfully');  
});

//get conversation by id
const getConversationById = expressAsyncHandler(async (req, res) => {
    const { conversationId } = req.params;
    if(conversationId == 'new') return res.json([]);
    const messages = await Messages.find({ conversationId });
    const messageUserData = Promise.all(messages.map(async (message) => {
        const user = await Users.findById(message.senderId);
        return { user: { name: user.username, email: user.email }, message: message.message }
    }))
    res.send(await messageUserData)
});

module.exports = {
    createConversation,
    getConverstation,
    postMessage,
    getConversationById
}