const mongoose = require("mongoose");
const config=require('../configurations/db/db.config')

const OrderSchema = mongoose.Schema({
  name: String,
  price: Number,
  quantity: Number,
  productId: String,
  userId: String,
  status: String,
  timeStamp: Number,
});

const Orders = mongoose.model("cart", OrderSchema);

// exports.editItem = (id, newData) => {
//   return new Promise((resolve, reject) => {});
// };
module.exports = { Orders };
