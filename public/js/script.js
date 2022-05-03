let menu = document.querySelector('#menu-bar');
let navbar = document.querySelector('.navbar');
let header = document.querySelector('.header-2');
menu.addEventListener('click', () => {
    menu.classList.toggle('fa-times');
    navbar.classList.toggle('active');
});

window.onscroll = () => {
    menu.classList.remove('fa-times');
    navbar.classList.remove('active');

    if (window.scrollY > 150) {
        header.classList.add('active');
    } else {
        header.classList.remove('active');
    }

}

//---------------------code for dashboard stat here----------------------------

//for enable/disable submit button of update,delete 
var deletechek = document.getElementsByClassName('checkboxoption');
var sendbtn = document.getElementsByClassName('checkboxButton');
// when unchecked or checked, run the function
    for(let i=0;i<deletechek.length;i++){
        let x;
        x=i;
        deletechek[x].onchange=function(){
            console.log("change")
            if(this.checked){
                console.log("change false i="+i)
                sendbtn[i].disabled = false;
            } else {
                console.log("change true i="+i)
                sendbtn[i].disabled = true;
            }

    }

}
//code for showing SNo. in dashboard 
var sn=document.getElementsByClassName("sn");
for(let i=0;i<sn.length;i++){
    console.log("i=="+i);
    sn[i].innerHTML=i+1;
}

//---------------------code for dashboard end here----------------------------


//---------------------code for inc\dec quntity of item and save localStorage to start here----------------------------


function quantity(id,add_sub,price,gtvalue) {
    const no_of_itemid=document.getElementById('no_of_item'+id);
    const totalprice=document.getElementById('totalprice');
    const discount=document.getElementById('discount');
    const saveLine=document.getElementById('save-line');
    console.log(no_of_itemid.value.slice(3));
    var value=parseInt(no_of_itemid.value);
    console.log("value"+value);
    console.log("id"+id);
    console.log("price"+price);
    if(price!=undefined){
        console.log("#################inside1")
        var totalitem=document.getElementById("totalitem");
        var grandtotal=document.getElementById("grandtotal");
        console.log("grandtotal"+grandtotal.innerHTML);
        console.log("totalitem"+totalitem.innerHTML);
    }
        
    console.log("quantity");   
    console.log("event"+id);   
    console.log("add_sub"+add_sub);   
    if(add_sub=='-')
    {
    
        console.log("gtvalue@@@@@@@@"+gtvalue);   
        if(gtvalue){
            totalitem.innerHTML=parseInt(totalitem.innerHTML)-value;
            grandtotal.innerHTML=parseInt(grandtotal.innerHTML)-parseInt(price*value);
        }
        else
        if(value>1)
        {
            value--;
            no_of_itemid.value=value;
            if(price!=undefined){
                let valuegrandtotal=parseInt(grandtotal.innerHTML)-parseInt(price)
                console.log("#################inside2")
                console.log("totalitem.innerHTML+value"+totalitem.innerHTML);
                console.log("grandtotal.innerHTML+price*value"+grandtotal.innerHTML);
                totalitem.innerHTML=parseInt(totalitem.innerHTML)-1;
                grandtotal.innerHTML=valuegrandtotal;
                totalprice.innerHTML='₹'+(valuegrandtotal+(valuegrandtotal*33)/100).toFixed(0);
                discount.innerHTML='-₹'+((valuegrandtotal*33)/100).toFixed(0);
                saveLine.innerHTML='You will save ₹'+((valuegrandtotal*33)/100).toFixed(0)+' on this order';;


            }
        }
    }
    if(add_sub=='+')
    {
        if(value<20)
        {
            value++;
            no_of_itemid.value=value;
            if(price!=undefined){    
                let valuegrandtotal=parseInt(grandtotal.innerHTML)+parseInt(price);            
                console.log("totalitem.innerHTML+value"+totalitem.innerHTML);
                console.log("grandtotal.innerHTML+price*value"+grandtotal.innerHTML);
                totalitem.innerHTML=parseInt(totalitem.innerHTML)+1;
                grandtotal.innerHTML=valuegrandtotal;                
                totalprice.innerHTML='₹'+(valuegrandtotal+(valuegrandtotal*33)/100).toFixed(0);
                discount.innerHTML='-₹'+((valuegrandtotal*33)/100).toFixed(0);
                saveLine.innerHTML='You will save ₹'+((valuegrandtotal*33)/100).toFixed(0)+' on this order';
            }
        }
        else
        {
            alert("only 20 kg can buy");
        }
    }
    
    if(window.localStorage.getItem(id)){
        window.localStorage.setItem(id,value);
    }
    

}
function removecart(id,price){
    // console.log("clearing localStorage");
    // const cartbtnid=document.getElementById('cart'+id);
    // console.log(cartbtnid);
    
    // cartbtnid.removeAttribute("href");
    console.log("remove");

    localStorage.removeItem(id);
    console.log("localStorage.length="+localStorage.length);
    var cartboxid=document.getElementById("cartbox"+id);
    console.log(cartboxid);
    // cartboxid.innerHTML="";
    cartboxid.style.display="none";
    quantity(id,'-',price,true);
    if(localStorage.length===0){
        
        var total=document.getElementById("total");
        total.innerHTML='<h1>Go to product</h1>'
        total.setAttribute("onclick","location.href='/product'");
    }


    // window.location.reload();
}
var itemvalue=0;
function aad_to_cart(id){
    const no_of_itemid=document.getElementById('no_of_item'+id);
    const cartbtnid=document.getElementById('cart'+id);
    console.log(no_of_itemid);
    var value=parseInt(no_of_itemid.value);
    console.log(value);
    window.localStorage.setItem(id,value);
    window.localStorage.setItem(`product${itemvalue}`,id);
    itemvalue++;
    console.log(cartbtnid);
    cartbtnid.innerHTML="Go to Cart";
    cartbtnid.setAttribute("onclick","location.href='/addtocart'");
}

//---------------------code for inc\dec quntity of item and save localStorage to end here----------------------------





let countDate = new Date("22 SEPTEMBER 2021 1:00:00").getTime();

function CountDown() {

    let now = new Date().getTime();
    gap = countDate - now;

    let second = 3600;
    let minute = second * 60;
    let hour = minute * 60;
    let day = hour * 24;

    let d = Math.floor(gap / (day));
    let h = Math.floor((gap % (day)) / (hour));
    let m = Math.floor((gap % (hour)) / (minute));
    let s = Math.floor((gap % (minute)) / (second));

    document.getElementById('day').innerText = d;
    document.getElementById('hour').innerText = h;
    document.getElementById('minute').innerText = m;
    document.getElementById('second').innerText = s;

}

setInterval(function () {
    // CountDown();
}, 3600)