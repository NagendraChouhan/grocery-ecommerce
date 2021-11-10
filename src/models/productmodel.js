const mongoose=require("mongoose");

const productschema= new mongoose.Schema({
  name: {
    type:String,
    require:true
  },
  price : {
    type:Number,
    require:true
  },
  fileID:{
    type: String,
    require:true
  },
  decription: {
    type:String,
    require:true
  },
  available: {
    type:Boolean,
    require:true
  },
  priority: {
    type:Number,
    default:1,
  },
  date : {
    type:Date,
    default: Date.now
  },
  modify_dates : { 
    type:Date,
  }
})

const productDetail=new mongoose.model("productDetail",productschema);
module.exports=productDetail;
