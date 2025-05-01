require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const auth = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const errorHandler = require('./middleware/errorMiddleware')


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
app.use('/api/translations', require('./routes/translationRoutes'))
app.use('/api/bulk', require('./routes/bulkOperations'))
app.use('/api/nlp', require('./routes/nlpRoutes'));


app.use(errorHandler);
//connect to db

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => {
        //listen for requests
        app.listen(process.env.PORT, () => {
            console.log('Connected to the db & Server is running on port', process.env.PORT)
        })
    })
    .catch((error) => {
        console.log(error)
    })
    