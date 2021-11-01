const mongoose=require("mongoose");
mongoose.connect("mongodb+srv://vegitable:-LaLG28xPfW$aR_@cluster0.4k2d8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
{useNewUrlParser: true, useUnifiedTopology: true }).then(
    ()=>console.log("connection successfull....")).catch((err)=>console.log(err));
