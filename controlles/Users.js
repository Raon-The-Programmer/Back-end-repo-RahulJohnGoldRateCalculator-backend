const bcrypt = require('bcrypt')
const User =  require('../models/User')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../utils/config')

const userController = {
    signUp : async(req,res)=>{
        try{
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
        res.status(201).json({message:'User created Successfully!!',user:savedUser})
    
    }catch(err){
        res.status(500).json({error:err.message})
    }
},
getUserList:async(req,res)=>{
    try{
        const userList = await User.find({})
        return res.status(200).json(userList)
    }catch(err){
        res.status(500).json({error:err.message})
    }
},
signIn:async(req,res)=>{
    try{
        const {username,password} = req.body
        const user = await User.findOne({username})
        if(!user){
            return res.status(401).json({Message: "User Not Found:("})  
        }
        const passwordCheck = await bcrypt.compare(password,user.passwordHash)
        if(!passwordCheck){
            return res.status(401).json({Message: "Invalid Password:("})
        }
       
        const payload = {
            username:user.username,
            name:user.name,
            id:user._id
        }
        const token = jwt.sign(payload,JWT_SECRET,{expiresIn:'1hr'})
        
        return res.status(200).json({username:user.username,name:user.name,Token:token})
    }   
    catch(err){
        return res.status(500).json({error:err.message})
    }
},
getProfile: async(req,res)=>{
    try{
        const userId = req.userId
        const user = await User.findById(userId,{username:1,name:1})
        return res.status(200).json(user)
    }
    catch(err){
        return res.status(500).json({error:err.message})
    }
},
editProfile:async(req,res)=>{
    try{
    const userId = req.userId
    const {username,name}=req.body
    const user = await User.findByIdAndUpdate(userId,{name,username},{new:true})
    return res.status(200).json({message:"User updated successfully!!",user})}
    catch(err){
        return res.status(500).json({error:err.message})
    }
},
deleteProfile:async(req,res)=>{
    try{
    const userId = req.userId
    const user = await User.findByIdAndDelete(userId)
    return res.status(200).json({message:"User deleted successsfully!!"})
    }
    catch(err){
        return res.status(500).json({error:err.message})
    }
}
    
}

module.exports = userController;