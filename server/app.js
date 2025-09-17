const express = require('express');

const authRouter = require('./controllers/authController');
const userRouter = require('./controllers/userController');
const chatRouter = require('./controllers/chatController');
const messageRouter = require('./controllers/messageController');


const app = express();

// converting req.body from json to js object
app.use(express.json({limit: '50mb'}));

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

// creating an array containing all the online users
const onlineUsers = [];

// test socket connetion from client
io.on('connection', socket => {
    // listening and joining join-room event coming from client
    socket.on('join-room', userId => {
        socket.join(userId);
    });

    // listening send-message event coming from client
    socket.on('send-message', (message) => {
        // sending data to a specific client using socket.to() method
        io
        .to(message.members[0])
        .to(message.members[1])
        .emit('receive-message', message);
    });

    socket.on('clear-unread-messages', data => {
        io
        .to(data.members[0])
        .to(data.members[1])
        .emit('unread-message-count-cleared', data);
    });

    socket.on('user-typing', data => {
        io
        .to(data.members[0])
        .to(data.members[1])
        .emit('started-typing', data);
    });

    socket.on('user-login', userId => {
        if(!onlineUsers.includes(userId)) {
            onlineUsers.push(userId);
        }

        socket.emit('online-users', onlineUsers);
    });
});


module.exports = server;
