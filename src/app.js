const express=require("express");
const hbs=require("hbs");
const bcryptjs=require("bcryptjs");
const jwt=require("jsonwebtoken");
const db=require("./db/conn.js");
const userDetails=require("./models/usermodel.js");
const adminDetails=require("./models/adminmodel.js");
const productDetail=require("./models/productmodel.js");
const  {userauthentication,adminauthanticaton,commanauth}=require("./middleware/authentication");
const path=require("path");

const firebase=require("./firebase/firebasesdk"); 
const cookieParser =require("cookie-parser");

const app=express();
const port=process.env.port || 3000;
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
    console.log("@@@@@@@@");
    console.log("@@@@@@@@");
    console.log("$$$$$$$$$$");

    if(req.userdata!=undefined && req.userdata!=null){
        console.log("@@@@@@@@token");
        login=false;
    }
    if(req.admindata!=undefined && req.admindata!=null){
        console.log("@@@@@@@@admintoken");
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
        console.log("@@@@@@@@token");
        login=false;
    }
    if(req.admindata!=undefined && req.admindata!=null){
        console.log("@@@@@@@@admintoken");
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
        console.log("@@@@@@@@token");
        login=false;
    }
    if(req.admindata!=undefined && req.admindata!=null){
        console.log("@@@@@@@@admintoken");
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
        console.log("@@@@@@@@token");
        login=false;
    }
    if(req.admindata!=undefined && req.admindata!=null){
        console.log("@@@@@@@@admintoken");
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
        console.log("@@@@@@@@token");
        login=false;
    }
    if(req.admindata!=undefined && req.admindata!=null){
        console.log("@@@@@@@@admintoken");
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
        name:user,
    });    
})
app.get("/logout",userauthentication,async(req,res)=>{
    try {    
        if(req.userdata!=undefined){
            //user is define in authentication
            console.log("user filter");
            req.userdata.tokens= req.userdata.tokens.filter((currentElement)=>{
                //token is define/modify in authentication
                return currentElement.token !== req.token; 
            })
            res.clearCookie("token");
            await req.userdata.save();
        }
        if(req.admindata!=undefined){
            console.log("admin filter");
            //admin is define in authentication
            req.admindata.tokens= req.admindata.tokens.filter((currentElement)=>{ 
                // console.log("filter");
                //token is define/modify in authentication
                return currentElement.token !== req.atoken; 
            })
            res.clearCookie("token");
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
        console.log("@@@@@@@@token");
        login=false;
    }
    if(req.admindata!=undefined && req.admindata!=null){
        console.log("@@@@@@@@admintoken");
        adminlogin=true;
        login=false;
    }
    res.render("login",{
        loginValue:login,
    });
})

app.post("/login",async(req,res)=>{
    try {

        //#################### user log in code start #################


        const email=req.body.email;
        const password=req.body.password;
        console.log("email="+email);
        console.log("password="+password);

        // const err="";
        const useremail=await userDetails.findOne({email:email});
        console.log("useremail="+useremail);
        if(useremail===null){
            console.log("user email not found");
            // res.status(400).send("emial are naot match");
            //#################### user log in code pause #################


            //#################### admin log in code start #################


            const adminemail=await adminDetails.findOne({email:email});
            console.log("adminemail="+adminemail);
            if(adminemail===null){
                console.log("admin email not found");
                res.status(400).send("admin email are not match");    
            }
            else{
                console.log("admin match");
                const isMatch=await bcryptjs.compare(password,adminemail.password);
                console.log("admin password M="+isMatch);
    
                console.log("admin login token");
                const token= await adminemail.generateToten();
                console.log(token);
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

                console.log("cookie token "+req.cookies.admintoken);
    
                if(isMatch){
                    console.log("admin password M="+isMatch);
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
                    // err="password are note match";
                    // res.render("login");
                    res.status(400).send("admin pass are not match");
                }
            }

            //#################### admin log in code end #################

        }

        //#################### user log in code resume #################

        else if(useremail.block===true){
            console.log("err you are not alow to exis your acount");
            res.status(400).send("you are not alow to exis your acount");
        }
        else{
            console.log("user match");
            const isMatch=await bcryptjs.compare(password,useremail.password);
            console.log("user password M="+isMatch);

            console.log("user login token");
            const token= await useremail.generateToten();
            console.log(token);
            console.log(token);
            res.cookie("token",token,{
                expires:new Date(Date.now()+600000),
                httpOnly:true,
                // secure:true
                
            });

            console.log("cookie token "+req.cookies.token);
            
            if(isMatch){
                console.log("user password M="+isMatch);
                login=false;
                logout=true;
                res.status(201).render("index",{
                    loginValue:login,
                });
            }
            else{
                console.log("err user pass");
                // err="password are note match";
                // res.render("login");
                res.status(400).send("user pass are not match");
            }
        }
        
        
        //#################### user log in code end #################
        

    } catch (error) {
        res.status(400).send(error);
        console.log("err"+error);
    }
})
app.get("/singup",commanauth("singup"),(req,res)=>{
    login=true;
    if(req.userdata!=undefined && req.userdata!=null){
        console.log("@@@@@@@@token");
        login=false;
    }
    if(req.admindata!=undefined && req.admindata!=null){
        console.log("@@@@@@@@admintoken");
        adminlogin=true;
        login=false;
    }
    res.render("index",{
        loginValue:login,
        adminloginValue:adminlogin,
    });
})
app.post("/singup",async(req,res)=>{
    try {
        console.log("singup");
        const username=req.body.username;
        const useremail=await userDetails.findOne({email:username});
        if(useremail===null){
            console.log("if email");
            const password=req.body.pass;
            const repassword=req.body.rPass;
            if(password===repassword){
                const name=req.body.name;
                const phone=req.body.phoneNo;
                const gender=req.body.gender;
                const dob=req.body.dob;
                console.log("if pass");
                const reguserDetails=new userDetails({
                    name:name,
                    email:username,
                    password:password,
                    phone:phone,
                    gender:gender,
                    dob:dob
                })
                console.log("singup token");
                const token= await reguserDetails.generateToten();
                console.log(token);
                const register=await reguserDetails.save();
                console.log("if regi");
                res.status(201).render("login",{
                    loginValue:login,
                    adminloginValue:adminlogin,
                });
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
        console.log("singup err");
        res.status(400).send(error);
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
app.get("/dashboard/singup",adminauthanticaton,(req,res)=>{
    if(req.admin!=undefined && req.admin!=null){
        console.log("@@@@@@@@admintoken");
        adminlogin=true;
        login=false;
    }
    res.render("singup",{
        loginValue:login,
        adminloginValue:adminlogin,
    });
})
app.post("/dashboard/singup",adminauthanticaton,async(req,res)=>{
    try {
        console.log("admin singup");
        const username=req.body.username;
        const adminemail=await adminDetails.findOne({email:username});
        if(adminemail===null){
            console.log("if email");
            const password=req.body.pass;
            const repassword=req.body.rPass;
            if(password===repassword){
                const name=req.body.name;
                const phone=req.body.phoneNo;
                const gender=req.body.gender;
                const dob=req.body.dob;
                const type=req.body.type;
                console.log("if pass");
                if(type==="admin"){
                    const regAdminDetails=new adminDetails({
                        name:name,
                        email:username,
                        password:password,
                        phone:phone,
                        gender:gender,
                        dob:dob
                    })
                    console.log("singup token");
                    const token= await regAdminDetails.generateToten();
                    console.log(token);
                    const register=await regAdminDetails.save();
                    console.log("if regi");
                    res.status(201).render("singup",{
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
        console.log("singup err");
        res.status(400).send(error);
    }
})
app.get("/addproduct",adminauthanticaton,(req,res)=>{
    if(req.admin!=undefined && req.admin!=null){
        console.log("@@@@@@@@admintoken");
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

        console.log("available="+available);
            if(available==="on"){
                available=true;
                console.log("available true="+available);
            }
            else{
                available=false;
                console.log("available false="+available);
            }
            console.log("available after ="+available);

        if(deletecheckbox==="on"){
            console.log("deletecheckbox="+deletecheckbox);
            try {
                const result = await productDetail.deleteOne({
                    _id:id
                })
                console.log("result form delete of add product ="+result);
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
                console.log("id="+id);
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
                 console.log("update result from addproduct="+result);
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
                console.log("id="+id);
                const result=await userDetails.updateOne(
                    { _id: id },
                    {
                        $set : {
                            block:true
                        }
                    }
                 )
                 console.log("update result from addproduct="+result);
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
        
        console.log("product save");
    } catch (error) {
        console.log("products err="+error);
        res.status(400).send("products err="+error);
    }
    
})
app.get("/updatedata",adminauthanticaton,(req,res)=>{
    if(req.admin!=undefined && req.admin!=null){
        console.log("@@@@@@@@admintoken");
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
        console.log("@@@@@@@@admintoken");
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
        console.log("@@@@@@@@admintoken");
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





    // app.get("/dashboard/singup",(req,res)=>{
    //     res.render("singup");
    // })
    // app.post("/dashboard/singup", async(req,res)=>{
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
    //             res.status(201).render("singup");
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
