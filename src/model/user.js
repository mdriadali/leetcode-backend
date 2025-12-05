const mongoose =require('mongoose') ;
const { Schema } = mongoose;

const userSchema=new Schema({
    firstName:{
        type:String,
        required:true,
        minLength:2,
        maxLength:20
    },
    lastName:{
        type:String,
        minLength:2,
        maxLength:20
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        immutable:true,
        lowercase:true,
        trim:true
    },
    age:{
        type:Number,
        min:5,
        max:80
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:['admin','user'],
        default:'user'
    },
    problemSolved:{
        type:[{
            type:Schema.Types.ObjectId,
            ref:'problem'
        },],
        unique:true
    },
    password:{
        type:String,
        required:true
    }
},{ 
    timestamps: true
 })

 const User=mongoose.model('User',userSchema)
 module.exports=User;