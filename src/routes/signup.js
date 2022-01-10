const express=require("express");
const router=express.Router();
const  {commanauth}=require("../middleware/authentication");
const userDetails=require("../models/usermodel.js");
const verifyuser=require("../models/verifyuser.js");
const {otpsendfunction,generateotp}=require("../functionFile/functions.js");

var validator = require('validator');


var login=true;
var logout=false;
var adminlogin=false;

//signup routes

router.get("/",commanauth("signup"),(req,res)=>{
    login=true;
    if(req.userdata!=undefined && req.userdata!=null){
        login=false;
    }
    if(req.admindata!=undefined && req.admindata!=null){
        adminlogin=true;
        login=false;
    }
    res.render("index",{
        loginValue:login,
        adminloginValue:adminlogin,
    });
})
router.post("/",async(req,res)=>{
    try {
        const username=req.body.username;
        if(!validator.isEmail(username)){
            throw new Error('Invalid Email');
        }
        
        console.log("useremail=="+username);
        var userDetailsemail=await userDetails.findOne({email:username});
        if(userDetailsemail!=null){
            throw new Error ("email is already registered");
        }
        var useremail=await verifyuser.findOne({email:username});
        console.log("useremail=="+useremail);
        
        if(useremail!= null){
            console.log("useremail=="+useremail.email);
            console.log("inside delete of user verify");
            
            const result = await verifyuser.deleteOne({
                email:useremail.email
            })
            console.log("result from user verify=="+result);
        }
        useremail=await verifyuser.findOne({email:username});
        if(useremail===null){
            console.log("inside add user verify");

            // console.log("if email");
            const password=req.body.pass;
            const repassword=req.body.rPass;
            if(!validator.isStrongPassword(password)){
                throw new Error('Password Is Not Strong Please Change It');
            }
            
            if(password===repassword){
                
                const name=req.body.name;
                console.log("name=="+name);

                // if(!validator.isAlpha(name,'en-AU', 'en-GB', 'en-HK', 'en-IN', 'en-NZ', 'en-US', 'en-ZA', 'en-ZM', 'es-ES')){
                //     throw new Error('Name only Contain Alphabet');
                // }
                //console.log("if pass");
                var otpsend=await generateotp();

                console.log("otpsend==="+otpsend);
                const regverifyuser=new verifyuser({
                    name:name,
                    email:username,
                    password:password,
                    otp:otpsend
                })
                console.log("user data is ready to save");
                const register=await regverifyuser.save();
                console.log("user data is saved");
                
                console.log("otp function callinh");
                otpsendfunction(username,name,otpsend);
                console.log("otp send");
                
                res.status(201).render("otp",{
                    loginValue:login,
                    adminloginValue:adminlogin,
                    username:username,
                });


              
            }
            else{
                console.log("password else");
                throw new Error('Password are Not Match');
            }
        }
        else{
            console.log("email else");
            throw new Error('Emial is Exist');
        }
    } catch (error) {
        console.log("signup err"+error);
        res.status(201).render("signup",{
            loginValue:login,
            adminloginValue:adminlogin,
            signuperror:error,
            username:req.body.username,
            password:req.body.pass,
            name:req.body.name,
            phone:req.body.phoneNo,
        });
    }
})

module.exports=router;