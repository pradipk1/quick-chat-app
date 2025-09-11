const router = require('express').Router();

const authMiddleware = require('./../middlewares/authMiddleware');
const Chat = require('./../models/chat');
const Message = require('./../models/message');


// creating a new chat
router.post('/create-new-chat', authMiddleware, async (req, res) => {
    try {
        const chat = new Chat(req.body);

        const savedChat = await chat.save();

        await savedChat.populate('members');

        res.status(201).send({
            message: 'chat created successfully',
            success: true,
            data: savedChat
        });
    } catch (error) {
        res.status(400).send({
            message: error.message,
            success: false
        });
    }
});

// getting all chats of a user
router.get('/get-all-chats', authMiddleware, async (req, res) => {
    try {
        const allChats = await Chat.find({members: {$in: req.userId}})
                                .populate('members')
                                .populate('lastMessage')
                                .sort('-updatedAt');

        res.status(200).send({
            message: 'chat created successfully',
            success: true,
            count: allChats.length,
            data: allChats
        });
    } catch (error) {
        res.status(400).send({
            message: error.message,
            success: false
        });
    }
});

// clearing unread message count
router.post('/clear-unread-message', authMiddleware, async (req, res) => {
    try {
        const chatId = req.body.chatId;

        const chat = await Chat.findById(chatId);

        if(!chat) {
            res.send({
                message: 'No chat found with given chat ID.',
                success: false
            });
        }

        // 1. update the unread message count in chat collection
        const updatedChat = await Chat.findByIdAndUpdate(
            chatId, {unreadMessageCount: 0}, {new: true}
        ).populate('members').populate('lastMessage');

        // 2. update the read property to true in message collection
        await Message.updateMany({chatId, read: false}, {read: true});

        res.send({
            message: 'Unread message cleared successfully.',
            success: true,
            data: updatedChat
        });
    } catch (error) {
        res.send({
            message: error.message,
            success: false
        });
    }
});


module.exports = router;
