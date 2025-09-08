const express = require('express');

const authMiddleware = require('./../middlewares/authMiddleware');
const User = require('./../models/user');

const router = express.Router();

// get logged in user details
router.get('/get-logged-user', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({_id: req.userId});

        res.send({
            message: 'user fetched successfully',
            success: true,
            data: user
        });
    } catch (error) {
        res.status(400).send({
            message: error.message,
            success: false
        });
    }
});

// get all users
router.get('/get-all-users', authMiddleware, async (req, res) => {
    try {
        const allUsers = await User.find({_id: {$ne: req.userId}});

        res.send({
            message: 'all users fetched successfully',
            success: true,
            data: allUsers
        });
    } catch (error) {
        res.status(400).send({
            message: error.message,
            success: false
        });
    }
});


module.exports = router;
