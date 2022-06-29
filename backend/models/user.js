const bcrypt = require('bcryptjs/dist/bcrypt');
const mongoose=require('mongoose');
const validator=require('validator');
const jwt=require('jsonwebtoken')
const crypto=require('crypto')

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please enter your name'],
        maxLength:[30,'Your name cannot exceed 30 characters']
    },
    email:{
        type:String,
        required:[true,'Please enter your email'],
        unique:true,
        validate:[validator.isEmail,'Please enter valid email address']
    },
    password:{
        type:String,
        required:[true,'Please enter your password'],
        minlength:[6,'Your password must be longer than 6 characters'],
        select:false
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{ 
            type:String,
            required:true
        }
    },
    role :{
        type :String,
        default :'admin'
    },

  
    createdAt :{
        type :Date,
        default: new Date(+new Date() + 7*24*60*60*1000)
        
    },
    // resetPasswordToken:String,
    // resetPasswordExpire:Date
    resetPasswordToken: {
        type: String,
        required: false
    },

    resetPasswordExpire: {
        type: Date,
        required: false
    }
    })
    
    userSchema.pre('save',async function(next){
        if(!this.isModified('password')){
            next()
        }
        this.password=await bcrypt.hash(this.password,10)
    })
    userSchema.methods.comparePassword=async function(enteredPassword){
        return await bcrypt.compare(enteredPassword,this.password)
    }

    userSchema.methods.getJwtToken=function(){
        return jwt.sign({id: this._id},process.env.JWT_SECRET,{
            expiresIn:process.env.JWT_EXPIRES_TIME
        })
    }
    userSchema.methods.getResetPasswordToken=function(){
        const resetToken=crypto.randomBytes(20).toString('hex');

        this.resetPasswordToken=crypto.createHash('sha256').update(resetToken).digest('hex')

        this.resetPasswordExpire=Date.now()+30*60*1000

        return resetToken
    }
module.exports=mongoose.model('User',userSchema);