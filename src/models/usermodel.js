const mongoose=require("mongoose");
const bcryptjs=require("bcryptjs");
const jwt=require("jsonwebtoken");

const userschema= new mongoose.Schema({
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
    },
    date : {
        type:Date,
        default: Date.now
    },
    address:[{
        country:String,
        state:String,
        district:String,
        tehsil:String,
        houseNo:String,
        colony:String,
        landmark:String,
        pinCode:Number,
    }],
    block:{
        type:Boolean
    },
    tokens:[{
        token:{
            type:String,
            require:true
        }
    }
    ]
})

userschema.methods.generateToten= async function(){
    try {
        console.log("generateToten");
        const token=jwt.sign({_id:this._id.toString()},"jwtformyvegitablewebsitewhichisusedforverifyingauthuserofmywebsite");
        this.tokens=this.tokens.concat({token:token});
        await this.save();
        console.log("generateToten completed");

        return token;
    } catch (error) {
        console.log("err from token is"+error);
    }
}
// userschema.pre("save",async function(next){
//     try {
//         if(this.isModified("password")){
//             this.password= await bcryptjs.hash(this.password,10);
//         }
//         next();
//     } catch (error) {
//         res.send("err in middware is="+error);
//     }
// })

const userDetails=new mongoose.model("userDetail",userschema);
module.exports=userDetails;