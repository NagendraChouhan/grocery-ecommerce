const express = require("express");
const router = express.Router();
const {
  userauthentication,
  commanauth,
} = require("../middleware/authentication");
const {
  otpsendfunction,
  generateotp,
} = require("../functionFile/functions.js");
const productDetail = require("../models/productmodel.js");
const userDetails = require("../models/usermodel.js");
const bcryptjs = require("bcryptjs");
const verifyuser = require("../models/verifyuser.js");
var validator = require("validator");
const sgMail = require("@sendgrid/mail");
const jwt = require("jsonwebtoken");
var PaytmChecksum = require("../Paytm_Node_Checksum-master/PaytmChecksum");

const stripe = require("stripe")(process.env.SECRET_KEY);

var login = true;
var logout = false;
var adminlogin = false;
var emplogin = false;

//home routes

router.get("/", userauthentication, (req, res) => {
  if (req.userdata != undefined && req.userdata != null) {
    login = false;
  }
  if (req.admindata != undefined && req.admindata != null) {
    adminlogin = true;
    login = false;
  }
  if (req.employeData != undefined && req.employeData != null) {
    emplogin = true;
    login = false;
  }
  productDetail.find({}, function (error, list) {
    console.log("productList==" + list);
    res.render("index", {
      loginValue: login,
      adminloginValue: adminlogin,
      emploginValue: emplogin,
      produvtList: list,
    });
  });

  // console.log("value /"+inout);
});
router.get("/contact", commanauth("contact"), (req, res) => {
  login = true;
  if (req.userdata != undefined && req.userdata != null) {
    login = false;
  }
  if (req.admindata != undefined && req.admindata != null) {
    adminlogin = true;
    login = false;
  }
  if (req.employeData != undefined && req.employeData != null) {
    emplogin = true;
    login = false;
  }
  res.render("contact", {
    loginValue: login,
    adminloginValue: adminlogin,
    emploginValue: emplogin,
  });
});
router.get("/product", commanauth("product"), (req, res) => {
  login = true;
  if (req.userdata != undefined && req.userdata != null) {
    login = false;
  }
  if (req.admindata != undefined && req.admindata != null) {
    adminlogin = true;
    login = false;
  }
  if (req.employeData != undefined && req.employeData != null) {
    emplogin = true;
    login = false;
  }
  productDetail.find({}, function (error, list) {
    res.render("product", {
      loginValue: login,
      adminloginValue: adminlogin,
      emploginValue: emplogin,
      userList: list,
    });
  });
});
router.get("/productdetails", commanauth("productdetails"), (req, res) => {
  // localStorage.setItem('myFirstKey', 'myFirstValue')
  login = true;
  if (req.userdata != undefined && req.userdata != null) {
    login = false;
  }
  if (req.admindata != undefined && req.admindata != null) {
    adminlogin = true;
    login = false;
  }
  if (req.employeData != undefined && req.employeData != null) {
    emplogin = true;
    login = false;
  }
  const id = req.query.id;
  if (id === undefined || id === null) {
    productDetail.find({}, function (error, list) {
      res.render("product", {
        loginValue: login,
        adminloginValue: adminlogin,
        emploginValue: emplogin,
        userList: list,
      });
    });
  }
  console.log("id from productdetails=" + id);
  productDetail.findOne({ _id: id }, function (error, list) {
    console.log("productDetails error=" + error);
    res.render("productdetails", {
      loginValue: login,
      adminloginValue: adminlogin,
      emploginValue: emplogin,
      product: list,
    });
  });
});
router.get("/addtocart", commanauth("addtocart"), (req, res) => {
  login = true;
  if (req.userdata != undefined && req.userdata != null) {
    login = false;
  }
  if (req.admindata != undefined && req.admindata != null) {
    adminlogin = true;
    login = false;
  }
  if (req.employeData != undefined && req.employeData != null) {
    emplogin = true;
    login = false;
  }
  productDetail.find({}, function (error, list) {
    res.render("addtocart", {
      loginValue: login,
      adminloginValue: adminlogin,
      emploginValue: emplogin,
      productlist: list,
    });
  });
});
router.get("/logout", userauthentication, async (req, res) => {
  try {
    if (req.userdata != undefined) {
      //user is define in authentication
      // req.userdata.tokens = req.userdata.tokens.filter((currentElement) => {
      //   //token is define/modify in authentication
      //   return currentElement.token !== req.token;

      // });
      req.userdata.tokens = [];
      res.clearCookie("token");
      await req.userdata.save();
    }
    if (req.admindata != undefined) {
      //admin is define in authentication
      req.admindata.tokens = req.admindata.tokens.filter((currentElement) => {
        // console.log("filter");
        //token is define/modify in authentication
        return currentElement.token !== req.atoken;
      });
      res.clearCookie("token");
      res.clearCookie("admintoken");
      await req.admindata.save();
    }

    if (req.employeData != undefined) {
      //admin is define in authentication
      req.employeData.tokens = req.employeData.tokens.filter(
        (currentElement) => {
          // console.log("filter");
          //token is define/modify in authentication
          return currentElement.token !== req.token;
        }
      );
      res.clearCookie("token");
      res.clearCookie("employetoken");
      await req.employeData.save();
    }

    res.clearCookie("token");
    // console.log("value logout before"+inout);
    login = true;
    logout = false;
    adminlogin = false;
    // console.log("value logout after"+inout);
    console.log("logout successfully");

    res.render("login", {
      loginValue: login,
      adminloginValue: adminlogin,
      emploginValue: emplogin,
    });
  } catch (error) {
    console.log(error);
    res.status(401).send("err in logout" + error);
  }
});
router.post("/forgotPassword", async (req, res) => {
  try {
    const username = req.body.email;
    const userDetailsemail = await userDetails.findOne({ email: username });
    if (userDetailsemail === null) {
      throw new Error("Invalid Email");
    } else {
      console.log("fg inside else");
      var useremail = await verifyuser.findOne({ email: username });
      //delete data which is exist with same email
      if (useremail != null) {
        console.log("useremail==" + useremail.email);
        console.log("inside delete of user verify");

        const result = await verifyuser.deleteOne({
          email: useremail.email,
        });
        console.log("result from user verify==" + result);
      }
      useremail = await verifyuser.findOne({ email: username });

      otpsend = await generateotp();
      console.log("fg after generate otp fun" + otpsend);
      const regverifyuser = new verifyuser({
        email: username,
        otp: otpsend,
      });
      const register = await regverifyuser.save();

      otpsendfunction(username, userDetailsemail.name, otpsend);
      console.log("fg after otp send fun");
      res.render("otp", {
        loginValue: login,
        adminloginValue: adminlogin,
        emploginValue: emplogin,
        username: req.body.email,
        otpVisible: false,
        updatePassotp: true,
        nameotp: "Email Verification otp",
        // updatePass:true,
      });
    }
  } catch (error) {
    console.log("err from fg ===" + error);
    res.render("otp", {
      loginValue: login,
      adminloginValue: adminlogin,
      emploginValue: emplogin,
      otperr: error,
      username: req.body.email,
      otpVisible: true,
      nameotp: "Email Verification",
    });
  }
});
router.post("/chechupdatepassotp", async (req, res) => {
  try {
    const username = req.body.email;
    const otp = req.body.otp;
    const useremail = await verifyuser.findOne({ email: username });

    if (useremail.otp == otp) {
      res.status(201).render("otp", {
        loginValue: login,
        adminloginValue: adminlogin,
        emploginValue: emplogin,
        email: req.body.email,
        nameotp: "Email Verification",
        updatePass: true,
      });
    } else {
      throw Error;
    }
  } catch (error) {
    res.render("otp", {
      loginValue: login,
      adminloginValue: adminlogin,
      emploginValue: emplogin,
      username: req.body.email,
      nameotp: "Email Verification",
      updatePassotp: true,
      updatePass: false,
      otperr: "Invalid OTP",
    });
  }
});
router.patch("/updatepassword", async (req, res) => {
  try {
    const username = req.body.email;
    const pass = req.body.pass;
    const rpass = req.body.rPass;
    const useremail = await verifyuser.findOne({ email: username });

    console.log("username==" + username);
    console.log("pass==" + pass);
    console.log("rpass==" + rpass);

    // res.render("login",{
    //     loginValue:login,
    //     adminloginValue:adminlogin,
    //     emploginValue:emplogin,
    // });

    if (pass === rpass) {
      if (!validator.isStrongPassword(pass)) {
        throw new Error("Password Is Not Strong Please Change It");
      }
      console.log("pass from update==" + pass);
      let password = await bcryptjs.hash(pass, 10);
      console.log("pass from update==" + password);
      await userDetails.updateOne(
        { email: username },
        {
          $set: {
            password: password,
          },
        }
      );
      console.log("after pass udade from updatepass");
      res.render("login");
    } else {
      throw new Error("password are not macth");
    }
  } catch (error) {
    console.log("error from updatepassword" + error);
    res.render("login", {
      loginValue: login,
      adminloginValue: adminlogin,
      emploginValue: emplogin,
      email: req.body.email,
      nameotp: "Email Verification",
      updatePass: true,
      changepasserr: error,
    });
  }
});
router.get("/otp", (req, res) => {
  login = true;
  var forgotPassword;
  var nameotpValue = "OTP";
  console.log("req.query.forgotPassword==" + req.query.forgotPassword);
  if (req.query.forgotPassword == "fg") {
    forgotPassword = true;
    nameotpValue = "Email Verification";
  }
  console.log("forgotPassword==" + forgotPassword);

  if (req.userdata != undefined && req.userdata != null) {
    login = false;
  }
  if (req.admindata != undefined && req.admindata != null) {
    adminlogin = true;
    login = false;
  }
  if (req.employeData != undefined && req.employeData != null) {
    emplogin = true;
    login = false;
  }
  res.render("otp", {
    loginValue: login,
    adminloginValue: adminlogin,
    emploginValue: emplogin,
    otpVisible: forgotPassword,
    nameotp: nameotpValue,
  });
});
router.post("/otp", async (req, res) => {
  try {
    console.log("otp post");
    const username = req.body.email;
    if (!validator.isEmail(username)) {
      throw new Error("Invalid Email");
    }
    console.log("otp username==" + username);
    const useremail = await verifyuser.findOne({ email: username });
    if (useremail != null) {
      const otp = req.body.otp;
      console.log("otp==" + otp);
      console.log("useremail.otp==" + useremail.otp);

      if (useremail.otp == otp) {
        const reguserDetails = new userDetails({
          name: useremail.name,
          email: useremail.email,
          password: useremail.password,
        });
        console.log("useremail.password" + useremail.password);
        console.log("useremail.password" + reguserDetails.password);
        const token = await reguserDetails.generateToten();
        const register = await reguserDetails.save();
        const result = await verifyuser.deleteOne({
          email: useremail.email,
        });

        sgMail.setApiKey(process.env.SENDEMAIL_API_KEY);
        const msg = {
          to: username, // EMAIL SEND TO
          from: "nikku200109@gmail.com", // EMAIL SEND BY
          subject: "Baren Welcome",
          text: "Hello" + useremail.name + " Welcome to Baren",
          html:
            "Hello<strong>," + useremail.name + "</strong> Welcome to Baren",
        };
        sgMail
          .send(msg)
          .then(() => {
            console.log("Email sent");
          })
          .catch((error) => {
            console.error("err from send email==" + error);
          });

        res.status(201).render("login", {
          loginValue: login,
          adminloginValue: adminlogin,
          emploginValue: emplogin,
        });
      } else {
        console.log("Otp not match else");
        throw new Error("Invalid OTP");
      }
    } else {
      console.log("email else");
      throw new Error("Emial is Exist");
    }
  } catch (error) {
    console.log("OTP err" + error);
    res.status(201).render("otp", {
      loginValue: login,
      adminloginValue: adminlogin,
      emploginValue: emplogin,
      otperr: error,
      username: req.body.email,
    });
  }
});
router.get("/payment",async(req,res)=>{
  if (req.userdata != undefined && req.userdata != null) {
    login = false;
  }
  if (req.admindata != undefined && req.admindata != null) {
    adminlogin = true;
    login = false;
  }
  if (req.employeData != undefined && req.employeData != null) {
    emplogin = true;
    login = false;
  }
  const token = req.cookies.token;      
  const tokenvarify=jwt.verify(token,process.env.JWT_TOKEN);
  const detail = await userDetails.findOne({_id:tokenvarify._id});
  console.log("name==="+detail)

  res.render("pay",{
    name:detail.name,
    key:process.env.PUBLISHABLE_KEY
  });
})
router.post("/payment", async (req, res) => {
  /* import checksum generation utility */

  /* initialize JSON String */
  body = "{/*YOUR_COMPLETE_REQUEST_BODY_HERE*/}";
  const _id = req.params.id;
  const token = req.cookies.token;      
  const tokenvarify=jwt.verify(token,process.env.JWT_TOKEN);
  const detail = await userDetails.findOne({_id:tokenvarify._id});
  
  console.log("name==="+detail)
  var paymentDetails = {
    name: detail.name,
    id: detail._id,
    email: detail.email,
  };

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'T-shirt',
            },
            unit_amount: 2000,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:4242/success.html',
      cancel_url: 'http://localhost:4242/cancel.html',
    });
  
    res.redirect(303, session.url);
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
  // stripe.customers
  //   .create({
  //     email: req.body.stripeEmail,
  //     source: req.body.stripeToken,
  //     name: detail.name,
  //     address: {
  //       line1: 'TC 9/4 Old MES colony',
  //       postal_code: '110092',
  //       city: 'New Delhi',
  //       state: 'Delhi',
  //       country: 'India',
  //     }
  //   })
  //   .then((customer) => {
  //     return stripe.charges.create({
  //       amount: 7000, // Charing Rs 25
  //       description: "Web Development Product",
  //       currency: "usd",
  //       customer: customer.id,
  //     });
  //   })
  //   .then((charge) => {
  //     res.send("Success"); // If no error occurs
  //   })
  //   .catch((err) => {
  //     res.send(err); // If some error occurs
  //   });

  console.log("id=" + detail);
});
module.exports = router;
