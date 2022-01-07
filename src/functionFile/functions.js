require('dotenv').config();
const sgMail = require('@sendgrid/mail')


function otpsendfunction(uto,uname,uotp){
    sgMail.setApiKey("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");
    console.log(process.env.SENDEMAIL_API_KEY);
    const msg = {
    to: uto, // EMAIL SEND TO
    from: 'nikku200109@gmail.com', // EMAIL SEND BY
    subject: 'Baren otp',
    text: 'Hello'+uname+' Your otp is-'+uotp,
    html: 'Hello<strong>,'+uname+'</strong> Your otp is-'+uotp,
    }
    sgMail
    .send(msg)
    .then(() => {
        console.log('Email sent')
    })
    .catch((error) => {
        console.error("err from send email=="+error)
        
        res.status(400).send("Error =="+error);
    })
}

function generateotp(){
    let num='1234567890';
    var otpsend='';
    for(let i=0;i<4;i++){
        let value=parseInt(num[Math.floor(Math.random()*10)]);
        if(value==0 && otpsend==''){
            value=1;
            console.log("value000==="+value);
        }
        console.log("value==="+value);
        otpsend+=value;
        console.log("otpsend==="+otpsend);
    }
    return otpsend;
}

module.exports={
    otpsendfunction,
    generateotp
}