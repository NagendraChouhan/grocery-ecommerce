const express=require("express");
const hbs=require("hbs");
const bcryptjs=require("bcryptjs");
const jwt=require("jsonwebtoken");
const db=require("./db/conn.js");
const userDetails=require("./models/usermodel.js");
const adminDetails=require("./models/adminmodel.js");
const productDetail=require("./models/productmodel.js");
const verifyuser=require("./models/verifyuser.js");
const  {userauthentication,adminauthanticaton,commanauth}=require("./middleware/authentication");
const path=require("path");
var validator = require('validator');
const sgMail = require('@sendgrid/mail')
require('dotenv').config()

const firebase=require("./firebase/firebasesdk"); 
const cookieParser =require("cookie-parser");

const app=express();
const port=process.env.PORT || 3000;
var login=true;
var logout=false;
var adminlogin=false;
const staticpath=path.join(__dirname,"../public");
const partialspath=path.join(__dirname,"../views/partials");

app.set('view engine','hbs');
app.use(express.static(staticpath));
hbs.registerPartials(partialspath);
app.use(cookieParser());

app.use(express.urlencoded({extended:false}));

// console.log("value 1"+inout);
app.get("/",userauthentication,(req,res)=>{
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
    // console.log("value /"+inout);

})

app.get("/contact",commanauth("contact"),(req,res)=>{
    login=true;
    if(req.userdata!=undefined && req.userdata!=null){
        
        login=false;
    }
    if(req.admindata!=undefined && req.admindata!=null){
        adminlogin=true;
        login=false;
    }
    res.render("contact",{
        loginValue:login,
        adminloginValue:adminlogin,
    });
})
app.get("/product",commanauth("product"),(req,res)=>{
    login=true;
    if(req.userdata!=undefined && req.userdata!=null){
        login=false;
    }
    if(req.admindata!=undefined && req.admindata!=null){
        adminlogin=true;
        login=false;
    }
    productDetail.find({},function(error,list){
        res.render("product",{
            loginValue:login,
            adminloginValue:adminlogin,
            userList:list, 
        });
    })
})
app.get("/productdetails",commanauth("productdetails"),(req,res)=>{
    // localStorage.setItem('myFirstKey', 'myFirstValue')
    login=true;
    if(req.userdata!=undefined && req.userdata!=null){
        login=false;
    }
    if(req.admindata!=undefined && req.admindata!=null){
        adminlogin=true;
        login=false;
    }
    const id=req.query.id;
    if(id===undefined || id===null){
        productDetail.find({},function(error,list){
            res.render("product",{
                loginValue:login,
                adminloginValue:adminlogin,
                userList:list, 
            });
        })
    }
    console.log("id from productdetails="+id);
    productDetail.findOne({_id:id},function(error,list){
        console.log("productDetails error="+error);
        res.render("productdetails",{
            loginValue:login,
            adminloginValue:adminlogin,
            product:list, 
        });
    })
})
app.get("/addtocart",commanauth("addtocart"),(req,res)=>{
    login=true;
    if(req.userdata!=undefined && req.userdata!=null){
        login=false;
    }
    if(req.admindata!=undefined && req.admindata!=null){
        adminlogin=true;
        login=false;
    }
    productDetail.find({},function(error,list){
        res.render("addtocart",{
            loginValue:login,
            adminloginValue:adminlogin,
            productlist:list, 
        });
    })
})
app.get("/profile",userauthentication,async(req,res)=>{
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
    console.log("admin varify");
    res.render("profile",{
        loginValue:false,
        adminloginValue:adminlogin,
        data:user,
    });    
})
app.get("/address",commanauth("login"),async(req,res)=>{
    login=true;
    var user;
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
    });    
})
app.post("/address",async(req,res)=>{
    try{
        console.log("address");
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
            
        // const register=await result.save();

        productDetail.find({},function(error,list){
            res.render("pay",{
                loginValue:login,
                logoutValue:logout,
                adminloginValue:adminlogin,
                productlist:list,
                alert:true

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
app.get("/logout",userauthentication,async(req,res)=>{
    try {    
        if(req.userdata!=undefined){
            //user is define in authentication
            req.userdata.tokens= req.userdata.tokens.filter((currentElement)=>{
                //token is define/modify in authentication
                return currentElement.token !== req.token; 
            })
            res.clearCookie("token");
            await req.userdata.save();
        }
        if(req.admindata!=undefined){
            //admin is define in authentication
            req.admindata.tokens= req.admindata.tokens.filter((currentElement)=>{ 
                // console.log("filter");
                //token is define/modify in authentication
                return currentElement.token !== req.atoken; 
            })
            res.clearCookie("token");
            res.clearCookie("admintoken");
            await req.admindata.save();
        }
        
        res.clearCookie("token");
        // console.log("value logout before"+inout);
        login=true;
        logout=false;
        adminlogin=false;
        // console.log("value logout after"+inout);
        console.log("logout successfully");
    
        res.render("login",{
            loginValue:login,        
            adminloginValue:adminlogin,
        });
    } catch (error) {
        console.log(error);
        res.status(401).send("err in logout"+error);
    }
})
app.get("/login",commanauth("login"),(req,res)=>{
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

app.post("/login",async(req,res)=>{
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
                res.status(201).render("login",{
                    loginValue:true,
                    username:req.body.email,
                    loginerr:"Invalid Email and Password",
                });  
            }
            else{
                const isMatch=await bcryptjs.compare(password,adminemail.password);
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

                
                if(isMatch){
                    // console.log("value login before"+inout);
                    login=false;
                    logout=true;
                    adminlogin=true;
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
            const token= await useremail.generateToten();
           res.cookie("token",token,{
                expires:new Date(Date.now()+600000),
                httpOnly:true,
                // secure:true
                
            });

            
            if(isMatch){
                login=false;
                logout=true;
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
app.get("/signup",commanauth("signup"),(req,res)=>{
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
app.post("/signup",async(req,res)=>{
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
                let num='1234567890';
                var otpsend='';
                for(let i=0;i<4;i++){
                    let value=parseInt(num[Math.floor(Math.random()*10)]);
                    if(value==0 && otpsend==''){
                        value=1;
                        console.log("value000==="+value);
                    }
                    console.log("value==="+value);


                    otpsend+=value;
                    console.log("otpsend==="+otpsend);
                }

                // otpsend=parseInt(otpsend)+1000;
                console.log("otpsend==="+otpsend);
                const regverifyuser=new verifyuser({
                    name:name,
                    email:username,
                    password:password,
                    otp:otpsend
                })
                
                const register=await regverifyuser.save();
                console.log("process.env.SENDEMAIL_API_KEY="+process.env.SENDEMAIL_API_KEY);
                sgMail.setApiKey(process.env.SENDEMAIL_API_KEY);
                const msg = {
                to: username, // EMAIL SEND TO
                from: 'nikku200109@gmail.com', // EMAIL SEND BY
                subject: 'Baren otp',
                text: 'Hello'+name+' Your otp is-'+otpsend,
                html: 'Hello<strong>,'+name+'</strong> Your otp is-'+otpsend,
                }
                sgMail
                .send(msg)
                .then(() => {
                    console.log('Email sent')
                })
                .catch((error) => {
                    console.error("err from send email=="+error)
                    
                    res.status(400).send("Error =="+error);
                })

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
app.get("/otp",(req,res)=>{
    login=true;
    if(req.userdata!=undefined && req.userdata!=null){
        login=false;
    }
    if(req.admindata!=undefined && req.admindata!=null){
        adminlogin=true;
        login=false;
    }
    res.render("otp",{
        loginValue:login,
        adminloginValue:adminlogin,
    });
})
app.post("/otp",async(req,res)=>{
    try {
        console.log("otp post");
        const username=req.body.email;
        if(!validator.isEmail(username)){
            throw new Error('Invalid Email');
        }
        console.log("otp username=="+username);
        const useremail=await verifyuser.findOne({email:username});
        if(useremail!=null){
            const otp=req.body.otp;
            console.log("otp=="+otp);
            console.log("useremail.otp=="+useremail.otp);

            if(useremail.otp==otp){
                const reguserDetails=new userDetails({
                    name:useremail.name,
                    email:useremail.email,
                    password:useremail.password,
                })
                console.log("useremail.password"+useremail.password);
                console.log("useremail.password"+reguserDetails.password);
                const token= await reguserDetails.generateToten();
                const register=await reguserDetails.save();
                const result = await verifyuser.deleteOne({
                    email:useremail.email
                })
                
                sgMail.setApiKey(process.env.SENDEMAIL_API_KEY);
                const msg = {
                to: username, // EMAIL SEND TO
                from: 'nikku200109@gmail.com', // EMAIL SEND BY
                subject: 'Baren Welcome',
                text: 'Hello'+useremail.name+' Welcome to Baren',
                html: 'Hello<strong>,'+useremail.name+'</strong> Welcome to Baren',
                }
                sgMail
                .send(msg)
                .then(() => {
                    console.log('Email sent')
                })
                .catch((error) => {
                    console.error("err from send email=="+error)
                })

                res.status(201).render("login",{
                    loginValue:login,
                    adminloginValue:adminlogin,
                });
            }
            else{
                console.log("Otp not match else");
                throw new Error('Invalid OTP');
            }
        }
        else{
            console.log("email else");
            throw new Error('Emial is Exist');
        }
    } catch (error) {
        console.log("OTP err"+error);
        res.status(201).render("otp",{
            loginValue:login,
            adminloginValue:adminlogin,
            otperr:error,
            username:req.body.email,
        });
    }
})


app.get("/dashboard",adminauthanticaton,(req,res)=>{
    userDetails.find({},function(error,list){
        res.render("dashboard",{
            loginValue:login,
            userList:list, 
        });
    })
      
})
app.get("/dashboard/signup",adminauthanticaton,(req,res)=>{
    if(req.admin!=undefined && req.admin!=null){
        adminlogin=true;
        login=false;
    }
    res.render("signup",{
        loginValue:login,
        adminloginValue:adminlogin,
    });
})
app.post("/dashboard/signup",adminauthanticaton,async(req,res)=>{
    try {
        const username=req.body.username;
        const adminemail=await adminDetails.findOne({email:username});
        if(adminemail===null){
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
                    res.status(400).send("employee");
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
        console.log("signup err");
        res.status(400).send(error);
    }
})
app.get("/addproduct",adminauthanticaton,(req,res)=>{
    if(req.admin!=undefined && req.admin!=null){
        adminlogin=true;
        login=false;
    }
    res.render("addproduct",{
        loginValue:login,
        adminloginValue:adminlogin,
    });
      
})
app.post("/addproduct",adminauthanticaton,async(req,res)=>{
    try {
        const id=req.body.id;
        const name=req.body.name;
        const price=req.body.price;
        const file=req.body.image;
        const decription=req.body.decription;
        const deletecheckbox=req.body.deletecheckbox;
        const updatecheckboxproduct=req.body.updatecheckboxproduct;
        var available=req.body.available;
        var blockcheckboxuser=req.body.blockcheckbox;

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
                console.log("errot from update addproduct "+error);

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
                console.log("errot from update addproduct "+error);

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
app.get("/updatedata",adminauthanticaton,(req,res)=>{
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
app.get("/dashboarddeletedata",adminauthanticaton,(req,res)=>{
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
app.post("/dashboarddeletedata",adminauthanticaton,(req,res)=>{
    productDetail.find({},function(error,list){
        res.render("dashboarddeletedata",{
        loginValue:login,
        adminloginValue:adminlogin,
        productlist:list
        });
    })
})
app.get("/deshboardproductdata",adminauthanticaton,(req,res)=>{
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


app.listen(port,()=>{
    console.log('listinig from port'+port);
    console.log(__dirname,"../views/partials");
})

// function setvalue(alogin,alogout){
//     login=alogin;
//     logout=alogout;
// }

// module.exports={
//     setvalue:setvalue(),
// };





    // app.get("/dashboard/signup",(req,res)=>{
    //     res.render("signup");
    // })
    // app.post("/dashboard/signup", async(req,res)=>{
    //     try{
    //         const adminPass=req.body.adminPass;
    //         const adminRPass=req.body.adminRPass;
    //         if(adminRPass===adminPass){
    //             console.log("inside if");
    //             console.log(adminRPass);
    //             console.log(adminPass);
    //             const adminName=req.body.adminName;
    //             const adminUsername=req.body.adminUsername;
    //             const adminNo=req.body.adminNo;
    //             const gender=req.body.gender;
    //             const Dob=req.body.Dob;
    //             const newadminDetail=new adminDetail({
    //                 name:adminName,
    //                 email:adminUsername,
    //                 password:adminPass,
    //                 phone:adminNo,
    //                 gender:gender,
    //                 dob:Dob,
    //             })
    //             const register=await newadminDetail.save();
    //             res.status(201).render("signup");
    //         }
    //         else{
                
    //             console.log(adminRPass);
    //             console.log(adminPass);
    //             console.log("inside else");
    //             console.log("inside else1");
    //             console.log(pass_class);
    //             console.log("inside else2");
    //             pass_class.textContent="Password not match";
    //             console.log("inside else3");
    //         }
    
    //         // alert("Your request is recorder we contact you soon");
    //     }catch(error){
    //         res.status(400).send(error);
    //     }
    // })
