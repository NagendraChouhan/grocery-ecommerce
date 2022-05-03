
const express=require("express");
const router=express.Router();
const  {userauthentication}=require("../middleware/authentication");
const orderDetail=require("../models/ordermodel");
const userDetails=require("../models/usermodel");
const jwt = require("jsonwebtoken");





var login=true;
var logout=false;
var adminlogin=false;
var emplogin=false;


//profile routes

router.get("/",userauthentication,async(req,res)=>{
    var user;

    if(req.userdata!=null){
        user=req.userdata;
        console.log("inside userdata");

    }

    if(req.admindata!=null){
        user=req.admindata;
        console.log("inside admindata");
        adminlogin=true;

    }
    if(req.employeData!=null){
        user=req.employeData;
        emplogin=true;
    }

    const token = req.cookies.token;
    const tokenvarify = jwt.verify(token, process.env.JWT_TOKEN);
    const detail = await userDetails.findOne({ _id: tokenvarify._id });
    const productdetail = await orderDetail.findOne({ userid: detail.id });

    console.log("admin varify");
    res.render("profile",{
        loginValue:false,
        adminloginValue:adminlogin,
        emploginValue:emplogin,
        data:user,
        productdetail:productdetail.price
    });    
})
router.post("/",userauthentication,async(req,res)=>{
    const amount=(req.body.amount)/100;
    const token = req.cookies.token;
    const tokenvarify = jwt.verify(token, process.env.JWT_TOKEN);
    const detail = await userDetails.findOne({ _id: tokenvarify._id });

    const regorderDetail=new orderDetail({
        productid:"",
        userid:detail.id,
        price:amount,
    })
    
    const register=await regorderDetail.save();

    res.render("profile",{
        loginValue:false,
        adminloginValue:adminlogin,
        emploginValue:emplogin,
    });    
})

module.exports=router;