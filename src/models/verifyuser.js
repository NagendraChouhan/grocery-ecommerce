const mongoose=require("mongoose");
const bcryptjs=require("bcryptjs");

const verifyuserSchema= new mongoose.Schema({
    name: {
        type:String,
    },
    email : {
        type:String,
        require:true
    },
    password : {
        type:String,
    },
    otp :{
        type:Number,
        required:true,
    },  
})

verifyuserSchema.pre("save",async function(next){
    try {
        if(this.isModified("password")){
            this.password= await bcryptjs.hash(this.password,10);
        }
        next();
    } catch (error) {
        res.send("err in middware is="+error);
    }
})

const verifyuser=new mongoose.model("verifyuser",verifyuserSchema);
module.exports=verifyuser;