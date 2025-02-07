require('dotenv').config()

const express = require('express')
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
const { logEvents, logger } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const corsOrgin = require('./config/corsOrgin')

const app = express()

const PORT = process.env.PORT || 3500
connectDB()

app.use(logger)

app.use(cors(corsOrgin))

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use(cookieParser())

//seting the public directory
app.use(express.static('public'))

//routes
app.use('/', require('./routes/root'))
app.use('/user', require('./routes/userRoutes'))
app.use('/product', require('./routes/productRoutes'))
app.use('/conversation', require('./routes/conversationRoutes'))
app.use('/order', require('./routes/paymentRoutes'))

//bad requests
app.all('*', (req, res) => {
    if(req.accepts('html')) res.sendFile(path.join(__dirname, 'views', '404.html'))

    else if(req.accepts('json')) res.json({message: '404 Not Found'})
    
    else res.type('txt').send('404 Not Found')
})

app.use(errorHandler)

mongoose.connection.once('open', () => {
    console.log('DB Connected');
    app.listen(PORT, ()=> console.log('server running on port 3500'))
})

mongoose.connection.on('error', err => {
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})