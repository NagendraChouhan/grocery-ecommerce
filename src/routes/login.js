const express=require("express")
const router=express.Router();
const  {commanauth}=require("../middleware/authentication");
const userDetails=require("../models/usermodel.js");
const adminDetails=require("../models/adminmodel.js");
const employeDetails=require("../models/employemodel");
const bcryptjs=require("bcryptjs");


var login=true;
var logout=false;
var adminlogin=false;

//login routes

router.get("/",commanauth("login"),(req,res)=>{
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
    });
})
router.post("/",async(req,res)=>{
    try {
        //#################### user log in code start #################


        const email=req.body.email;
        const password=req.body.password;
         //=> true
        

        console.log("email="+email);
        console.log("password="+password);

        // const err="";
        const useremail=await userDetails.findOne({email:email});
        console.log("useremail="+useremail);
        if(useremail===null){
            console.log("user email not found");

            //#################### user log in code pause #################

            //#################### admin log in code start #################

            const adminemail=await adminDetails.findOne({email:email});
            console.log("adminemail="+adminemail);
            if(adminemail===null){
                console.log("admin email not found");  
                //#################### admin log in code pause #################

                //#################### employe log in code start #################

                const employeemail=await employeDetails.findOne({email:email});
                if(employeemail===null){
                    console.log("employe email not found");
                    res.status(201).render("login",{
                        loginValue:true,
                        username:req.body.email,
                        loginerr:"Invalid Email and Password",
                    });  
                }
                else{
                    console.log("inside employe log in");
                    const isMatch=await bcryptjs.compare(password,employeemail.password);                
                    if(isMatch){
                        console.log("inside employe isMatch log in");

                        // console.log("value login before"+inout);
                        login=false;
                        logout=true;
                        adminlogin=true;
                        const token= await employeemail.generateToten();
                        res.cookie("token",token,{
                            expires:new Date(Date.now()+600000),
                            httpOnly:true,
                            // secure:true
                        });
                        res.cookie("employetoken",token,{
                            expires:new Date(Date.now()+600000),
                            httpOnly:true,
                            // secure:true
                        });
                        // console.log("value login after"+inout);
                        
                        res.render("empdashboard",{
                            loginValue:login,
                            logoutValue:logout, 
                        });
                    
                    }
                    else{
                        console.log("err employe passnot match");
                        res.status(201).render("login",{
                            loginValue:true,
                            username:req.body.email,
                            loginerr:"Invalid Email and Password",
                        }); 
                    }
                }

                //#################### employe log in code end #################

            }
            //#################### admin log in code resume #################

            else{
                const isMatch=await bcryptjs.compare(password,adminemail.password);                
                if(isMatch){
                    // console.log("value login before"+inout);
                    login=false;
                    logout=true;
                    adminlogin=true;
                    const token= await adminemail.generateToten();
                    res.cookie("token",token,{
                        expires:new Date(Date.now()+600000),
                        httpOnly:true,
                        // secure:true
                    });
                    res.cookie("admintoken",token,{
                        expires:new Date(Date.now()+600000),
                        httpOnly:true,
                        // secure:true
                    });
                    // console.log("value login after"+inout);
                    userDetails.find({},function(error,list){
                        res.render("dashboard",{
                            loginValue:login,
                            logoutValue:logout,
                            userList:list, 
                        });
                    })
                }
                else{
                    console.log("err admin passnot match");
                    res.status(201).render("login",{
                        loginValue:true,
                        username:req.body.email,
                        loginerr:"Invalid Email and Password",
                    }); 
                }
            }

            //#################### admin log in code end #################

        }

        //#################### user log in code resume #################

        else if(useremail.block===true){
            console.log("Error Sorry, You are not allowed to access your acount");
            res.status(201).render("login",{
                loginValue:true,
                username:req.body.email,
                loginerr:"Sorry, You are not allowed to access your Acount",
            });
        }
        else{
            const isMatch=await bcryptjs.compare(password,useremail.password);
            if(isMatch){
                login=false;
                console.log("inside isMatch");
                logout=true;
                const token= await useremail.generateToten();
                res.cookie("token",token,{
                expires:new Date(Date.now()+600000),
                httpOnly:true,
                // secure:true
                
                });
                res.status(201).render("index",{
                    loginValue:login,
                });
            }
            else{
                console.log("err user pass");
                res.status(201).render("login",{
                    loginValue:true,
                    username:req.body.email,
                    loginerr:"Invalid Email and Password",
                });
            }
        }
        
        
        //#################### user log in code end #################
        

    } catch (error) {
        res.status(400).send(error);
        console.log("err"+error);
    }
})

module.exports=router;