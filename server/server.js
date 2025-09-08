const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const dbConfig = require('./config/dbConfig');
const app = require('./app');


const port = process.env.PORT_NUMBER;
app.listen(port, () => {
    console.log(('Listening to requests on PORT: ' + port));
});
