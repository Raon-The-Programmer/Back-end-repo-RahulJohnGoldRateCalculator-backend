const mongoose = require('mongoose')
const express = require('express')
const {MONGODB_URL,PORT}  = require('./utils/config')
const app = express()
const cors = require('cors')
const reqLogger = require('./utils/middleware')
const userRouter = require('./routes/userRoutes')

//connecting to database
mongoose.set('strictQuery',false)

mongoose.connect(MONGODB_URL)
    .then(()=>{
        console.log("Server Connected!")
        app.listen(PORT,()=>{
            console.log(`Server running at port ${PORT}`)
        })
    })
    .catch((err)=>{
        console.error('Error while connecting MONGODB: ',err)
    })


//middlewares
app.use(cors())
app.use(express.json())
app.use(reqLogger)


//Routers
app.use('/user',userRouter)
    