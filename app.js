require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const fileUpload = require('express-fileupload')
const requestTime = require('./middlewares/request-time')


const app = express()


app.use(express.json())
app.use(express.static('static'))
app.use(fileUpload({}))
app.use(requestTime)

// Routes
app.use('/api/post', require('./routers/post-route'))

const PORT = process.env.PORT || 8000

const bootstrap = async () => {
	try {
		await mongoose
			.connect(process.env.DB_URL)
			.then(() => console.log('Connected DB'))

		app.listen(PORT, () =>
			console.log(`Listening on - http://localhost:${PORT}`)
		)
	} catch (error) {
		console.log(`Error connecting with DB: ${error}`)
	}
}

bootstrap()