// const {setvalue}=require("../app");
const jwt=require("jsonwebtoken");
const userDetails=require("../models/usermodel.js");
const adminDetails=require("../models/adminmodel.js");
const employeDetails=require("../models/employemodel");
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
                console.log("admin data="+data);
            }
            if(req.admindata===null || req.admindata===undefined){
                const tokenvarify=jwt.verify(token,"jwtformyvegitablewebsitewhichisusedforverifyingauthuserofmywebsite");
                const data = await employeDetails.findOne({_id:tokenvarify._id});
                req.employeData=data;
                console.log("employe data="+data);

            }
            
      
            console.log("################ after verify auth user");
        
            req.token=token;
            next();
    } 
    catch (error) {
        
        console.log("err from auth=="+error);

        productDetail.find({},function( error,list){
            console.log("productList=="+list);
            res.render("index",{
                loginValue:true,
                logoutValue:false,
                produvtList:list,             
            });
        }).sort({ priority: -1 }).limit(5);
        
    }
}
const aauthantication=async(req,res,next)=>{
    try {
            console.log("call from aauthantication try");

            //for find user is login or not use authtoken
            var admintoken =req.cookies.admintoken;

            // console.log("auth token");

            // const admintoken =req.cookies.admintoken;
            
            const adminVarify=jwt.verify(admintoken,"jwtformyvegitablewebsitewhichisusedforverifyingauthuserofmywebsite");
            console.log("admintoken varify");
            const admin = await adminDetails.findOne({_id:adminVarify._id});
            console.log("admin id varify");
            req.admin=admin;
            req.atoken=admintoken;
            next();
    } catch (error) {
        console.log("er from aauthanticaton="+error);
        console.log("call from aauthanticaton");
        var login=true;
        var logout=false;
        if(admintoken!=undefined){
            login=false;
            logout=true;
        }
        productDetail.find({},function(error,list){
            console.log("productList=="+list);
            res.render("index",{
                loginValue:login,
                logoutValue:logout,
                produvtList:list,             
            });
        })
    }
}

const aempauthantication=async(req,res,next)=>{
    try {
            console.log("call from empauthantication try");

            //for find employe is login or not use aut
            var employetoken =req.cookies.employetoken;

            //chech employe is authanticate or not
            const tokenvarify=jwt.verify(employetoken,"jwtformyvegitablewebsitewhichisusedforverifyingauthuserofmywebsite");
            console.log("employetoken varify");
            const employe = await employeDetails.findOne({_id:tokenvarify._id});
            console.log("employetoken id varify");

            req.employe=employe;
            next();
    } catch (error) {
        console.log("er from empauthantication="+error);
        console.log("call from empauthantication");
        var login=true;
        var logout=false;
        if(employetoken!=undefined){
            login=false;
            logout=true;
        }
        productDetail.find({},function(error,list){
            console.log("productList=="+list);
            res.render("index",{
                loginValue:login,
                logoutValue:logout,
                produvtList:list,             
            });
        })
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
                if(req.admindata===null || req.admindata===undefined){
                    const tokenvarify=jwt.verify(token,"jwtformyvegitablewebsitewhichisusedforverifyingauthuserofmywebsite");
                    const data = await employeDetails.findOne({_id:tokenvarify._id});
                    req.employeData=data;
                    console.log("employe data="+data);
    
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
    adminauthanticaton:aauthantication,
    empauthantication:aempauthantication,
    commanauth:acommanauth,
}