const config = require('./utils/config');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const middleware = require('./utils/middleware');
const usersRouter = require('./controllers/users');

const app = express();

mongoose.set('strictQuery', false);

console.log('Connecting to MongoDB...');
mongoose.connect(config.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB:', error.message);
    });

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);

app.use('/api/users', usersRouter);

app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`);
});