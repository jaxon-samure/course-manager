const express = require('express')
const app = express()
const mongoose = require('mongoose')
require('dotenv').config()
const postModel = require('./models/post-model')


const PORT = process.env.PORT || 8000
const db_url = process.env.DB_URL

const connect_db = async () => {
    try{
        await mongoose.connect(db_url);
        console.log("Connected to db");
        app.listen(PORT, () => console.log(`Server run in ${PORT}`));
    } catch(error) {
        console.log(`error to connnect db: ${error}`);
    }
}


connect_db();
