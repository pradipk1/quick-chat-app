const router = require('express').Router();

const authMiddleware = require('../middlewares/authMiddleware');
const Message = require('../models/message');
const Chat = require('../models/chat');


// creating new message
router.post('/new-message', authMiddleware, async (req, res) => {
    try {
        // 1. storing message in the messages collection
        const newMessage = new Message(req.body);
        const savedMessage = await newMessage.save();

        // 2. updating lastMessage and unreadMessageCount in chat collection
        const currentChat = await Chat.findOneAndUpdate(
            {
                _id: req.body.chatId
            }, {
                lastMessage: savedMessage._id,
                $inc: {unreadMessageCount: 1}
            }
        );

        res.status(200).send({
            message: 'Message sent successfully',
            success: true,
            data: savedMessage
        });
    } catch (error) {
        res.status(400).send({
            message: error.message,
            success: false
        });
    }
});

// getting all messages of a user
router.get('/get-all-messages/:chatId', authMiddleware, async (req, res) => {
    try {
        const allMessages = await Message.find({chatId: req.params.chatId})
                                .sort({createdAt: 1});

        res.status(200).send({
            message: 'Messages fetched successfully',
            success: true,
            count: allMessages.length,
            data: allMessages
        });
    } catch (error) {
        res.status(400).send({
            message: error.message,
            success: false
        });
    }
});


module.exports = router;
