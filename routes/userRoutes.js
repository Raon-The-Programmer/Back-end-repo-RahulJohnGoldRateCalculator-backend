const express = require('express');
const userController = require('../controllers/users');
const userRouter = express.Router();

userRouter.post('/signup', userController.signup);

module.exports = userRouter;