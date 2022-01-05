
const express=require("express");
const router=express.Router();
const  {userauthentication}=require("../middleware/authentication");


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
    console.log("admin varify");
    res.render("profile",{
        loginValue:false,
        adminloginValue:adminlogin,
        emploginValue:emplogin,
        data:user,
    });    
})

module.exports=router;