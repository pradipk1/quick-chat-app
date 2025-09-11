const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const dbConfig = require('./config/dbConfig');
const server = require('./app');


const port = process.env.PORT_NUMBER;
server.listen(port, () => {
    console.log(('Listening to requests on PORT: ' + port));
});
