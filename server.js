require('dotenv').config();
const express = require('express')
const cors = require('cors')

const connectDB = require('./config/db');
const { port } = require('./config');

const auth = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const languageRoutes = require('./routes/languageRoutes');

//express app
const app = express()

//middleware
app.use(cors());
app.use(express.json())
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

//routes
app.use('/api/auth', auth);
app.use('/api/user', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/languages', languageRoutes);

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

console.log('Connecting to:', process.env.MONGO_URI);



if (!process.env.SECRET) {
    console.error("❌ SECRET is not defined in .env");
    process.exit(1);
  }
  