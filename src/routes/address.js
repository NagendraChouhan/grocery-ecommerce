const express=require("express");
const router=express.Router();
const  {commanauth}=require("../middleware/authentication");
const productDetail=require("../models/productmodel.js");
const userDetails=require("../models/usermodel.js");

const jwt = require("jsonwebtoken");


var login=true;
var logout=false;
var adminlogin=false;

//address routes

router.get("/",commanauth("login"),async(req,res)=>{
    login=true;
    var user;
    console.log("req.query.amountgets======"+req.query.amount)
    if(req.userdata!=undefined && req.userdata!=null){
        login=false;
        user=req.userdata;
    }
    if(req.admindata!=undefined && req.admindata!=null){
        adminlogin=true;
        user=req.admindata;
        login=false;
    }
    console.log("admin varify");
    res.render("address",{
        loginValue:login,
        adminloginValue:adminlogin,
        data:user,
        address:user.address,
        payment:req.query.amount
    });    
})
router.post("/",async(req,res)=>{
    try{
        console.log("address");
        console.log("req.query.amount======"+req.query.amount)
        const id=req.query.id;
        const country=req.body.country;
        const state=req.body.state;
        const district=req.body.district;
        const tehsil=req.body.tehsil;
        const houseNo=req.body.houseNo;
        const colony=req.body.colony;
        const landmark=req.body.landmark;
        const pinCode=req.body.pinCode;
        console.log("country"+country);
        console.log("id"+id);
        const result=await userDetails.updateOne(
            { _id: id.toString().trim() },
            {
                $push : {
                    address :  {
                             country,
                             state,
                             district,
                             tehsil,
                             houseNo,
                             colony,
                             landmark,
                             pinCode,

                           } //inserted data is the object to be inserted 
                }
            }
            );
            
            const token = req.cookies.token; 
            const tokenvarify=jwt.verify(token,process.env.JWT_TOKEN);
            const detail = await userDetails.findOne({_id:tokenvarify._id});    
        // const register=await result.save();
        productDetail.find({},function(error,list){
            res.render("pay",{
                loginValue:login,
                logoutValue:logout,
                adminloginValue:adminlogin,
                productlist:list,
                alert:true,
                payment:req.query.amount,
                name:detail.name,
                key:process.env.PUBLISHABLE_KEY

            });
        })
    } catch (error) {
        console.log("signup err"+error);
        res.status(201).render("address",{
            loginValue:login,
            adminloginValue:adminlogin,
            signuperror:error,
            country:req.body.country,
            state:req.body.state,
            district:req.body.district,
            tehsil:req.body.tehsil,
            houseNo:req.body.houseNo,
            colony:req.body.colony,
            landmark:req.body.landmark,
            pinCode:req.body.pinCode,
        });
    }
})

module.exports=router;