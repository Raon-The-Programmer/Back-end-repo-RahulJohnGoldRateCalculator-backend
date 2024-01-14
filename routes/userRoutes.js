const userController = require('../controlles/Users');
const userRouter = require('express').Router()
const authMiddleware = require('../middleware/authMiddleware')


userRouter.post('/signup',userController.signUp)
userRouter.get('/list',userController.getUserList)
userRouter.post('/signin',userController.signIn)
userRouter.post('/forgotpassword',userController.forgotPassword)
userRouter.post('/resetpassword/:userId/:token', userController.resetPassword);

userRouter.get('/profile',authMiddleware.verifyToken,userController.getProfile)
userRouter.put('/profile',authMiddleware.verifyToken,userController.editProfile)
userRouter.delete('/profile',authMiddleware.verifyToken,userController.deleteProfile)


module.exports=userRouter;