const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const revisionRoutes = require('./routes/revisionRoutes');
const translationRoutes = require('./routes/translationRoutes');

//express app
const app = express();

//middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

//routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/translations', revisionRoutes);
app.use('/api/translations', translationRoutes);


module.exports = app;