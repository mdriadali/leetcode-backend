const express = require("express");
const app = express();
const main = require("./config/Mongodb");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/userAuth");
const redisClient = require("./config/redis");
const problemRouter = require("./routes/problemRoute");
const submitRouter=require('./routes/submit')
const cors =require('cors');
const aiRouter = require("./routes/aiRouter");
const videoRouter = require("./routes/video");


app.use(cors({
  origin:'http://localhost:5173',
  credentials:true
}))

app.use('/get',(req, res)=>{
  res.send('Hello from backend')
})

app.use(express.json());
app.use(cookieParser());
app.use("/user", authRouter);
app.use("/problem", problemRouter);
app.use("/submission", submitRouter);
app.use("/ai", aiRouter);
app.use("/video", videoRouter);



const initializeConnection = async () => {
  try {
    Promise.all([main(), redisClient.connect()]);
    console.log("Connected to Database");
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log('error', error);
  }
};

initializeConnection();
