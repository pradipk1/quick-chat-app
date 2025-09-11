const express = require('express');

const authRouter = require('./controllers/authController');
const userRouter = require('./controllers/userController');
const chatRouter = require('./controllers/chatController');
const messageRouter = require('./controllers/messageController');


const app = express();

// converting req.body from json to js object
app.use(express.json());

// creating server using http package
const server = require('http').createServer(app);

// making a socket connection with the client
const io = require('socket.io')(server, {cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
}});

// creating and using APIs
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/chat', chatRouter);
app.use('/api/message', messageRouter);

// test socket connetion from client
io.on('connection', socket => {
    // listening join-room event coming from client
    socket.on('join-room', userid => {
        socket.join(userid);
    });

    // listening send-message event coming from client
    socket.on('send-message', (data) => {
        // sending data to a specific client using socket.to() method
        socket.to(data.recipient).emit('receive-message', data.text);
    });
});


module.exports = server;
