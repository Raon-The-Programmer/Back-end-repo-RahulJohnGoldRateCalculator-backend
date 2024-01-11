const userRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User =  require('../models/User')


userRouter.post('/',async(req,res)=>{
    const body  = req.body
  
    if(!body.password || body.password.length < 3){
        return res.status(400).json({
            error:'Password Invalid!'
        })
    }

    const passwordHash = await bcrypt.hash(body.password,10)

    const user = new User({
        username:body.username,
        name:body.name,
        passwordHash
    })

    const savedUser = await user.save()
    res.json(savedUser)

})

module.exports = userRouter