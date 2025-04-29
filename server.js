const express = require('express')
const cors = require('cors')
require('dotenv').config()

const connectDB = require('./config/db');
const { port } = require('./config');

const auth = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')

//express app
const app = express()

//middleware
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

//routes
app.use('/api/auth', auth)
app.use('/api/user', userRoutes)
app.use('/api', require('./routes/emailRoutes'));

//connect to db
connectDB().then(() => {
    const server = app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
    process.once('SIGUSR2', () => {
        server.close(() => process.kill(process.pid, 'SIGUSR2'));
    });
    process.on('SIGINT', () => {
        server.close(() => process.exit(0));
    });
});