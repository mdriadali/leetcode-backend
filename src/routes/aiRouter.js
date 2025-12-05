const express=require('express')
const aiRouter=express.Router()
const userMiddlewere=require('../middleware/userMidddleware')
const aiChat = require('../controller/aichat')


aiRouter.post('/chat', userMiddlewere, aiChat)

module.exports=aiRouter