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
    console.log('Connected with SocketId: ' + socket.id);
})


module.exports = server;
