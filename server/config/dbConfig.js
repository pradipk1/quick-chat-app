const mongoose = require('mongoose');

// connecting db
mongoose.connect(process.env.CONN_STRING);

// connection state
const db = mongoose.connection;

// checking connection
db.on('connected', () => {
    console.log('DB Connection Successfull!');
});

db.on('err', () => {
    console.log('DB Connection Failed!');
});

// exporting db
module.exports = db;
