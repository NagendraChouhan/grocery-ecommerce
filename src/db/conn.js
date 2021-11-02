const mongoose=require("mongoose");
//for online database
mongoose.connect("mongodb+srv://vegitable:-LaLG28xPfW$aR_@cluster0.4k2d8.mongodb.net/vegitable?retryWrites=true&w=majority",
{useNewUrlParser: true, useUnifiedTopology: true }).then(
    ()=>console.log("Online connection successfull....")).catch((err)=>{
        console.log(err)
        //for offline database
        mongoose.connect("mongodb://localhost:27017/vegitable",).then(
        ()=>console.log("ofline connection successfull....")).catch((err)=>console.log(err));
        }   
    );


    