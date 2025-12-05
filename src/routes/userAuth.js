const express = require("express");
const authRouter = express.Router();
const { register, adminRegister, login, logout,deleteProfile ,check } = require("../controller/userAuthCont");
const userMiddleware=require('../middleware/userMidddleware')
const adminMiddleware=require('../middleware/adminMiddleware')

authRouter.post("/register", register);
authRouter.post("/admin/register",adminMiddleware, adminRegister);
authRouter.post("/login", login);
authRouter.post("/logout",userMiddleware, logout);
authRouter.delete("/deleteprofile",userMiddleware, deleteProfile);
authRouter.get('/check',userMiddleware,check)
// authRouter.post('/getProfile', getProfile)

module.exports = authRouter;
