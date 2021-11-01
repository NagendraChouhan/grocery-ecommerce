const mongoose=require("mongoose");
mongoose.connect("mongodb+srv://vegitable:-LaLG28xPfW$aR_@cluster0.4k2d8.mongodb.net/vegitable").then(
    ()=>console.log("connection successfull....")).catch((err)=>console.log(err));
