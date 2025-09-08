const router = require('express').Router();

const authMiddleware = require('./../middlewares/authMiddleware');
const Chat = require('./../models/chat');


// creating a new chat
router.post('/create-new-chat', authMiddleware, async (req, res) => {
    try {
        const chat = new Chat(req.body);

        const savedChat = await chat.save();

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
        const allChats = await Chat.find({members: {$in: req.userId}});

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


module.exports = router;
