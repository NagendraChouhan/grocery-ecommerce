// const {setvalue}=require("../app");
const jwt=require("jsonwebtoken");
const userDetails=require("../models/usermodel.js");
const adminDetails=require("../models/adminmodel.js");
const productDetail=require("../models/productmodel");


const authentication=async(req,res,next)=>{
    try {
        const token =req.cookies.token;
        // console.log("auth token");
        // console.log(token);
        
        //     console.log("user varify1");
            const tokenvarify=jwt.verify(token,"jwtformyvegitablewebsitewhichisusedforverifyingauthuserofmywebsite");
            const data = await userDetails.findOne({_id:tokenvarify._id});
            // console.log("tokenvarify="+tokenvarify._id);
            // console.log("defined tokenvarify");
            req.userdata=data;
            //console.log("req.userdata"+req.userdata);
            if(req.userdata===null || req.userdata===undefined){
                //console.log("undefined tokenvarify");

                const tokenvarify=jwt.verify(token,"jwtformyvegitablewebsitewhichisusedforverifyingauthuserofmywebsite");
                const data = await adminDetails.findOne({_id:tokenvarify._id});
                req.admindata=data;
            

            }
            
      
            console.log("################ after verify auth user");
        
            req.token=token;
            next();
    } 
    catch (error) {
        
        console.log("err from auth=="+error);


        res.render("index",{
            loginValue:true,
            logoutValue:false,
        });
    }
}
const aauthanticaton=async(req,res,next)=>{
    try {
            //for find user is login or not use authtoken
            var admintoken =req.cookies.admintoken;

            // console.log("auth token");

            // const admintoken =req.cookies.admintoken;
            const adminVarify=jwt.verify(admintoken,"jwtformyvegitablewebsitewhichisusedforverifyingauthuserofmywebsite");
            console.log("admin varify");
            const admin = await adminDetails.findOne({_id:adminVarify._id});
            console.log("admin id varify");
            req.admin=admin;
            req.atoken=admintoken;
            next();
    } catch (error) {
        console.log("er from aauthanticaton="+error);
        var login=true;
        var logout=false;
        if(admintoken!=undefined){
            login=false;
            logout=true;
        }
        res.render("index",{
            
            loginValue:login,
            logoutValue:logout,
        });
    }
}

function acommanauth(renderto) {
    return async(req, res, next) =>{
        try {
            const token =req.cookies.token;
            // console.log("contact auth token");
                const tokenvarify=jwt.verify(token,"jwtformyvegitablewebsitewhichisusedforverifyingauthuserofmywebsite");
                const data = await userDetails.findOne({_id:tokenvarify._id});
                // console.log("defined tokenvarify");
                req.userdata=data;
                if(req.userdata===null || req.userdata===undefined){
                    // console.log("undefined tokenvarify");
                    const tokenvarify=jwt.verify(token,"jwtformyvegitablewebsitewhichisusedforverifyingauthuserofmywebsite");
                    const data = await adminDetails.findOne({_id:tokenvarify._id});
                    req.admindata=data;
                }
                next();
        } 
        catch (error) {
            console.log("err from acommanauth auth=="+error);
    
            if (renderto !==undefined && renderto!==null) {
                if(renderto==="product"){
                    productDetail.find({},function(error,list){
                        res.render("product",{
                            loginValue:true,
                            userList:list, 
                        });
                    })
                    
                }
                else if(renderto==="addtocart"){
                    productDetail.find({},function(error,list){
                        res.render("addtocart",{
                            loginValue:true,
                            productlist:list, 
                        });
                    })
                }
                else if(renderto==="productdetails"){
                    const id=req.query.id;
                    if(id===undefined || id===null){
                        productDetail.find({},function(error,list){
                            res.render("product",{
                                loginValue:true,
                                userList:list, 
                            });
                        })
                    }
                    productDetail.findOne({_id:id},function(error,list){
                        console.log("productDetails error="+error);
                        res.render("productdetails",{
                            loginValue:true,
                            product:list, 
                        });
                    })
                }
                else{
                    res.render(renderto,{
                        loginValue:true,
                    });
                }
              }
            else{
                res.render("/",{
                    loginValue:true,
                })
            }
        }
    }
}
module.exports= {
    userauthentication:authentication,
    adminauthanticaton:aauthanticaton,
    commanauth:acommanauth,
}