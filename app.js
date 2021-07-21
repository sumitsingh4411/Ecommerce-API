const express = require('express');
const cors = require('cors')
const app = express();
const mongoose = require('mongoose');
const path = require('path');


require('dotenv').config();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());

global.approot = path.resolve(__dirname);
app.use(express.urlencoded({ extended: false }));

//routes
const router = require('./routes/');
const errorHandler = require('./middleware/error');
app.use('/api', router);

// mongoDB connection
mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(() => {
    console.log('suceesfully connected');
}).catch((err) => {
    console.log('error in data base connection')
})


app.use('/uploads', express.static('uploads'));
app.use(errorHandler)
app.listen(PORT, () => {
    console.log('Listening on port', PORT);
})