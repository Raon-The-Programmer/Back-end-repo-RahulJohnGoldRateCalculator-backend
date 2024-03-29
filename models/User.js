const mongoose = require('mongoose')


const userShema = new mongoose.Schema({
    username:String,
    name:String,
    passwordHash:String,
})

userShema.set('toJSON',{
    transform:(document,returnedObject)=>{
        //returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id,
        delete returnedObject.__v,
        delete returnedObject.passwordHash
    }
})

module.exports = mongoose.model('User',userShema,'Users')