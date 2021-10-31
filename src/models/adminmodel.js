const mongoose=require("mongoose");
const bcryptjs=require("bcryptjs");
const jwt=require("jsonwebtoken");
console.log("mongose="+mongoose);
const adminschema= new mongoose.Schema({
    name: {
        type:String,
        require:true
    },
    email : {
        type:String,
        require:true
    },
    password : {
        type:String,
        require:true
    },    
    phone : {
        type:Number,
        require:true
    },
    gender : {
        type:String,
        require:true
    },
    dob : {
        type:Date,
        require:true
    },
    date : {
        type:Date,
        default: Date.now
    },
    tokens:[{
        token:{
            type:String,
            require:true
        }
    }
    ]
})

adminschema.methods.generateToten= async function(){
    try {
        console.log("generateToten");
        const token=jwt.sign({_id:this._id.toString()},"jwtformyvegitablewebsitewhichisusedforverifyingauthuserofmywebsite");
        this.tokens=this.tokens.concat({token:token});
        await this.save();
        return token;
    } catch (error) {
        res.send("err from token is"+error);
    }
}
adminschema.pre("save",async function(next){
    try {
        if(this.isModified("password")){
            this.password= await bcryptjs.hash(this.password,10);
        }
        next();
    } catch (error) {
        res.send("err in middware is="+error);
    }
})

const adminDetails=new mongoose.model("adminDetail",adminschema);
module.exports=adminDetails;