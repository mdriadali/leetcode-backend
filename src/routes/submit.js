const express=require('express')
const submitRouter=express.Router()
const userMiddlewere=require('../middleware/userMidddleware')
const {userSubmision,runCode}=require('../controller/userSubmission')


submitRouter.post("/submit/:id", userMiddlewere,userSubmision)
submitRouter.post("/run/:id",userMiddlewere,runCode)

module.exports=submitRouter