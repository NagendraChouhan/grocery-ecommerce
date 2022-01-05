const express=require("express");
const router=express.Router();
const  {empauthantication}=require("../middleware/authentication");

var login=true;
var logout=false;
var adminlogin=false;
var emplogin=false;

router.use("/",empauthantication);

//Emp routes


router.get("/",(req,res)=>{
    if(req.employe!==null && req.employe!==undefined){
        emplogin=true;
    }
    res.render("empdashboard",{
        emploginValue:emplogin
    });
})
module.exports=router;
