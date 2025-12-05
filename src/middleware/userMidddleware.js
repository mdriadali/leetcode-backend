const User = require("../model/user");
const redisClient = require("../config/redis");
const jwt = require("jsonwebtoken");

const userMiddleware = async (req, res, next) => {
  // console.log('first parms',+req.params)
  try {
    const { token } = req.cookies;

    if (!token) {
      throw new Error("Unauthorized");
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const { _id } = payload;

    const result = await User.findById(_id);

    if (!result) {
      throw new Error("Unauthorized");
    }

    const isBlocked =await redisClient.exists(`token:${token}`);
    if (isBlocked) {
      throw new Error("invalid token");
    }

    req.result = result;
    next();
  } catch (error) {
       res.status(401).send(error.message)
  }
};

module.exports = userMiddleware;
