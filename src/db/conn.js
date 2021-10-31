const mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/vegitable").then(
    ()=>console.log("connection successfull....")).catch((err)=>console.log(err));
