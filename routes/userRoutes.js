const express = require('express');
const userController = require('../controllers/users');
const authMiddleware = require('../middleware/authMiddleware');
const userRouter = express.Router();

userRouter.post('/signup', userController.signup);
userRouter.get('/list', userController.getUserList);
userRouter.post('/signin', userController.signin);

userRouter.get('/profile', authMiddleware.verifyToken, userController.getProfile);
userRouter.put('/profile', authMiddleware.verifyToken, userController.editProfile);
userRouter.delete('/profile', authMiddleware.verifyToken, userController.deleteProfile);

module.exports = userRouter;