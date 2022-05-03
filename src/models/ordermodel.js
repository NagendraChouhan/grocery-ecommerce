const mongoose = require("mongoose");

const orderschema = new mongoose.Schema({
  productid: [
    {
      type: String,
      require: true,
    },
  ],
  price: {
    type: Number,
    require: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const orderDetail = new mongoose.model("orderDetail", orderschema);
module.exports = orderDetail;
