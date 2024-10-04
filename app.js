require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const fileUpload = require('express-fileupload')
const requestTime = require('./middlewares/request-time')


const app = express()

//Middlewares

app.use(express.json())
app.use(express.static('static'))
app.use(fileUpload({}))
app.use(requestTime)

// Routes

app.use('/api/post', require('./routers/post-route'));
app.use('/api/auth', require('./routers/auth-route'));

const PORT = process.env.PORT || 8000

const dbURL = 'mongodb://127.0.0.1:27017/test';  

mongoose.connect(dbURL)
  .then(() => console.log('MongoDBga muvaffaqiyatli ulandik'))
  .catch(err => console.error('MongoDBga ulanishda xato:', err));

app.listen(PORT, () => {
	console.log(`Server run ${PORT}:`)
});

