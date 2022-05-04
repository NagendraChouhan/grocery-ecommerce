const express=require("express");
const router=express.Router();
const  {adminauthanticaton}=require("../middleware/authentication");
const userDetails=require("../models/usermodel.js");
const adminDetails=require("../models/adminmodel.js");
const productDetail=require("../models/productmodel.js");
const employeDetails=require("../models/employemodel");

// const {dashboard}=require("../controllers/dashboardController");



var login=true;
var logout=false;
var adminlogin=false;

//dashboard routes
router.use("/",adminauthanticaton);

router.get("/",(req,res)=>{
    if(req.admin!=undefined && req.admin!=null){
        adminlogin=true;
        login=false;
    }
    userDetails.find({},function(error,list){
        res.render("dashboard",{
            loginValue:login,
            userList:list, 
        });
    })
      
})
router.get("/signup",(req,res)=>{
    if(req.admin!=undefined && req.admin!=null){
        adminlogin=true;
        login=false;
    }
    res.render("signup",{
        loginValue:login,
        adminloginValue:adminlogin,
    });
})
router.post("/signup",async(req,res)=>{
    try {
        const username=req.body.username;
        const type=req.body.type;  //type value is admin/employe
        console.log("type of admin employe="+type);
        var emailcheck;
        if(type==="admin"){
            // if admin type is selected is here
            emailcheck=await adminDetails.findOne({email:username});
        }else{
            // if employe type is selected is here
            emailcheck=await employeDetails.findOne({email:username});
        }
        if(emailcheck===null || emailcheck===undefined){
            // console.log("if email");
            const password=req.body.pass;
            const repassword=req.body.rPass;
            if(password===repassword){
                const name=req.body.name;
                const phone=req.body.phoneNo;
                const gender=req.body.gender;
                const dob=req.body.dob;
                const type=req.body.type;
                if(type==="admin"){
                    const regAdminDetails=new adminDetails({
                        name:name,
                        email:username,
                        password:password,
                        phone:phone,
                        gender:gender,
                        dob:dob
                    })
                    const token= await regAdminDetails.generateToten();
                    const register=await regAdminDetails.save();
                    res.status(201).render("signup",{
                        loginValue:login,
                        logoutValue:logout,
                        adminloginValue:adminlogin,
                    });
                }
                else if(type==="employee"){
                    const regEmployeDetails= new employeDetails({
                        name:name,
                        email:username,
                        password:password,
                        phone:phone,
                        gender:gender,
                        dob:dob
                    })
                    await regEmployeDetails.generateToten();
                    await regEmployeDetails.save();
                    res.status(201).render("signup",{
                        loginValue:login,
                        logoutValue:logout,
                        adminloginValue:adminlogin,
                    });
                }
            }
            else{
                console.log("password else");
                // var repass=document.getElementById("repass");
                // repass.textContent="password are naot match";
                res.status(400).send("password are naot match");
            }
        }
        else{
            console.log("email else");
            // var repass=document.getElementById("repass");
            // repass.textContent="password are naot match";
            res.status(400).send("emial is exist");
        }
    } catch (error) {
        console.log("signup err=="+error);
        res.status(400).send(error);
    }
})
router.get("/addproduct",(req,res)=>{
    if(req.admin!=undefined && req.admin!=null){
        adminlogin=true;
        login=false;
    }
    res.render("addproduct",{
        loginValue:login,
        adminloginValue:adminlogin,
    });
      
})
router.post("/addproduct",async(req,res)=>{
    try {
        const id=req.body.id;
        const name=req.body.name;
        const price=req.body.price;
        const file=req.body.image;
        const decription=req.body.decription;
        const deletecheckbox=req.body.deletecheckbox;
        const updatecheckboxproduct=req.body.updatecheckbox;
        var available=req.body.available;
        var blockcheckboxuser=req.body.blockcheckbox;
        console.log("updatecheckboxproduct==="+updatecheckboxproduct)
        if(available==="on"){
            available=true;
        }
        else{
            available=false;
        }
        
        if(deletecheckbox==="on"){
            try {
                const result = await productDetail.deleteOne({
                    _id:id
                })
                productDetail.find({},function(error,list){
                    res.render("dashboarddeletedata",{
                    loginValue:login,
                    logoutValue:logout,
                    adminloginValue:adminlogin,
                    productlist:list,
                    });
                })
            } catch (error) {
                console.log("Error from delete of add product ="+error);
            }
        }
        else if(updatecheckboxproduct=="on"){
            try {
                console.log("update data");
                const result=await productDetail.updateOne(
                    { _id: id },
                    {
                        $set : {
                            name:name,
                            price:price,
                            fileID:file,
                            decription:decription,
                            available:available
                        }
                    }
                 )
                 productDetail.find({},function(error,list){
                    res.render("updatedata",{
                        loginValue:login,
                        logoutValue:logout,
                        adminloginValue:adminlogin,
                        productlist:list,
                        alert:true

                    });
                })
            } catch (error) {
                console.log("errot from update dashboard addproduct "+error);

            }

        }
        else if(blockcheckboxuser=="on"){
            try {
                const result=await userDetails.updateOne(
                    { _id: id },
                    {
                        $set : {
                            block:true
                        }
                    }
                 )
                 userDetails.find({},function(error,list){
                    res.render("dashboard",{
                        loginValue:login,
                        logoutValue:logout,
                        userList:list, 
                    });
                })
            } catch (error) {
                console.log("errot from update dashboard addproduct "+error);

            }

        }
        else{
            const regproductDetail=new productDetail({
                name:name,
                price:price,
                fileID:file,
                decription:decription,
                available:available
            })
            await regproductDetail.save();
            res.render("addproduct",{
                loginValue:login,
                adminloginValue:adminlogin,
            });
        }
        
    } catch (error) {
        console.log("products err="+error);
        res.status(400).send("products err="+error);
    }
    
})
router.get("/updatedata",(req,res)=>{
    if(req.admin!=undefined && req.admin!=null){
        adminlogin=true;
        login=false;
    }
    productDetail.find({},function(error,list){
        res.render("updatedata",{
        loginValue:login,
        adminloginValue:adminlogin,
        productlist:list
        });
    })
})
router.get("/deletedata",(req,res)=>{
    if(req.admin!=undefined && req.admin!=null){
        adminlogin=true;
        login=false;
    }
    productDetail.find({},function(error,list){
        res.render("dashboarddeletedata",{
        loginValue:login,
        adminloginValue:adminlogin,
        productlist:list
        });
    })
})
router.post("/deletedata",(req,res)=>{
    productDetail.find({},function(error,list){
        res.render("dashboarddeletedata",{
        loginValue:login,
        adminloginValue:adminlogin,
        productlist:list
        });
    })
})
router.get("/productdata",(req,res)=>{
    if(req.admin!=undefined && req.admin!=null){
        adminlogin=true;
        login=false;
    }
    productDetail.find({},function(error,list){
        res.render("deshboardproductdata",{
        loginValue:login,
        adminloginValue:adminlogin,
        productlist:list
        });
    })
})
module.exports=router;