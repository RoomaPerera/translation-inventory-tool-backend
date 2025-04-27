require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const auth = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')

// express app
const app = express()
app.use(cors());

//middleware
app.use(express.json())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

//routes
app.use('/api/auth', auth)
app.use('/api/user', userRoutes)

//connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        //listen for requests
        app.listen(process.env.PORT, () => {
            console.log('Connected to the db & Server is running on port', process.env.PORT)
        })
    })
    .catch((error) => {
        console.log(error)
    })