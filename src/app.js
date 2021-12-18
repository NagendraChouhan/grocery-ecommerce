require('dotenv').config()
const express=require("express");
const hbs=require("hbs");
const db=require("./db/conn.js");
const  {userauthentication,adminauthanticaton,commanauth}=require("./middleware/authentication");
const path=require("path");
const firebase=require("./firebase/firebasesdk"); 
const cookieParser =require("cookie-parser");
const { async } = require("@firebase/util");
const { errorMonitor } = require("stream");

//importing routes code start here

const dashboard=require("./routes/dashboard.js");
const login=require("./routes/login.js");
const signup=require("./routes/signup.js");
const home=require("./routes/home.js");
const address=require("./routes/address.js");
const profile=require("./routes/profile.js");

//importing router code end here



const app=express();
const port=process.env.PORT || 3000;

const staticpath=path.join(__dirname,"../public");
const partialspath=path.join(__dirname,"../views/partials");

app.set('view engine','hbs');
app.use(express.static(staticpath));
hbs.registerPartials(partialspath);
app.use(cookieParser());

app.use(express.urlencoded({extended:false}));


//call router code start here

app.use('/dashboard',dashboard);
app.use('/login',login);
app.use('/signup',signup);
app.use('/address',address);
app.use('/profile',profile);
app.use('/',home);

//call router code end here

app.listen(port,()=>{
    console.log('listinig from port'+port);
    console.log(__dirname,"../views/partials");
})