const express = require('express');

const authMiddleware = require('./../middlewares/authMiddleware');
const User = require('./../models/user');
const cloudinary = require('./../cloudinary');

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

// upload profilr pic api
router.post('/upload-profile-pic', authMiddleware, async (req, res) => {
    try {
        const image = req.body.image;

        // 1. upload the image to cloudinary
        const uploadedImage = await cloudinary.uploader.upload(image, {
            folder: 'quick-chat'
        });
        // console.log(uploadedImage);

        // 2. update the user model and set the profile pic property
        const user = await User.findByIdAndUpdate(
            req.userId,
            {profilePic: uploadedImage.secure_url},
            {new: true}
        );
        console.log(user);

        res.send({
            message: 'Profile picture uploaded successfully!',
            success: true,
            data: user
        });
    } catch (error) {
        res.send({
            message: error.message,
            success: false
        });
    }
});


module.exports = router;
