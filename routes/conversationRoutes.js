const router = require('express').Router();
const { authenticate } = require('../middleware/verifyJWT')
const { createConversation, getConverstation, postMessage, getConversationById } = require('../controllers/conversationController')

router.post('/', authenticate, createConversation);

router.get('/:userId', authenticate, getConverstation);

router.post('/sendMessage', authenticate, postMessage);

router.get('/userConversation/:conversationId', authenticate, getConversationById);

module.exports = router;