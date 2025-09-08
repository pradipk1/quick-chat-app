const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('./../models/user');

router.post('/signup', async (req, res) => {
    try {
        // 1. checking if user already exists
        const user = await User.findOne({email: req.body.email});

        // 2. if exists, sending an error response
        if(user) {
            return res.send({
                message: 'User already exists.',
                success: false
            });
        }

        // 3. encrypting the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword;

        // 4. creating and saving the new user in DB
        const newUser = new User(req.body);
        await newUser.save();

        res.status(201).send({
            message: 'User created successfully.',
            success: true
        });
        
    } catch (error) {
        res.send({
            message: error.message,
            success: false
        });
    }
});

router.post('/login', async (req, res) => {
    try {
        // 1. checking if user exists
        const user = await User.findOne({email: req.body.email}).select('password');
        
        if(!user) {
            return res.send({
                message: 'User does not exists.',
                success: false
            });
        }

        // 2. checking if the password is valid
        const isValid = await bcrypt.compare(req.body.password, user.password);
        if(!isValid) {
            return res.send({
                message: 'invalid password',
                success: false
            });
        }

        // 3. assigning a JWT
        const token = jwt.sign({userId: user._id}, process.env.SECRET_KEY, {expiresIn: '1d'});

        res.send({
            message: 'user logged in successfully.',
            success: true,
            token
        });
    } catch (error) {
        res.send({
            message: error.message,
            success: false
        });
    }
});

module.exports = router;
