const userValidate = require("../utils/userValidate");
const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const redisClient = require("../config/redis");
const Submissions = require("../model/submissions");

const register = async (req, res) => {
  try {
    userValidate(req.body);

    const { firstName, emailId, password } = req.body;
    req.body.password = await bcrypt.hash(password, 10);
    req.body.role = "user";

    const user = await User.create(req.body);
    const token = jwt.sign({_id:user._id, emailId:emailId, role:user.role }, process.env.JWT_SECRET, {
      expiresIn: 60 * 60,
    });

    const reply={
      firstName:user.firstName,
      emailId:user.emailId,
      _id:user._id,
      role:user.role

    }

    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
    res.status(201).json({
      user:reply,
      message:'User registered successfully'
    })
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const adminRegister = async (req, res) => {
  try {
    userValidate(req.body);

    const { firstName, emailId, password } = req.body;
    req.body.password = await bcrypt.hash(password, 10);
    req.body.role = "admin";

    const user = await User.create(req.body);
    const token = jwt.sign({_id:user._id, emailId:emailId, role:user.role }, process.env.JWT_SECRET, {
      expiresIn: 60 * 60,
    });

    const reply={
      firstName:user.firstName,
      emailId:user.emailId,
      _id:user._id,
      role:user.role

    }

    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
    res.status(201).json({
      user:reply,
      message:'Admin registered successfully'
    })
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const login = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!emailId) {
      throw new Error("Invalid credentials");
    }
    if (!password) {
      throw new Error("Invalid credentials");
    }

    const user= await User.findOne({emailId})
    const match= await bcrypt.compare(password,user.password)
    if (!match) {
      throw new Error("Invalid credentials");
    }

   

    const token=jwt.sign({_id:user._id, emailId:emailId, role:user.role},process.env.JWT_SECRET,{expiresIn:60*60})

     const reply={
      firstName:user.firstName,
      emailId:user.emailId,
      _id:user._id,
      role:user.role

    }

    res.cookie('token',token, {maxAge:60*60*1000})
    res.status(200).json({
      user:reply,
      message:'Login successfully'
    })

  } catch (error) {
    res.status(401).send(error.message)
  }
};


const logout = async (req, res) => {
    try {
       
      const {token}=req.cookies
      const payload=jwt.decode(token)

      await redisClient.set(`token:${token}` , 'blocked')
      await redisClient.expireAt(`token:${token}`, payload.exp)

      res.cookie('token',null,{expires:new Date(Date.now())} )
      res.status(200).send("User logged out successfully");


    } catch (error) {
        res.status(503).send(error.message);
    }
}

const deleteProfile=async(req,res)=>{
try {
  const userId=req.result._id

await User.findByIdAndDelete(userId)

await Submissions.deleteMany({userId})
res.status(200).send("USer Delete Successfully")
} catch (error) {
  res.status(500).send("Error:"+error)
}
}

const check=async(req, res)=>{
try {
  const reply={
      firstName:req.result.firstName,
      emailId:req.result.emailId,
      _id:req.result._id,
      role:req.result.role

    }

     res.status(201).json({
      user:reply,
      message:'user valid'
    })
} catch (error) {
  res.status(500).send("Error:"+error)
}
}

module.exports = { register,adminRegister, login, logout,deleteProfile ,check };