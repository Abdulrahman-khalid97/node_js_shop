const mongoose = require("mongoose");
const config=require('../configurations/db/db.config')

const cartSchecma = mongoose.Schema({
  name: String,
  price: Number,
  quantity: Number,
  productId: String,
  userId: String,
  status: {
    type: String,
    default: "pending",
  },
  timeStamp: Number,
});

const CartItem = mongoose.model("cart", cartSchecma);

// exports.editItem = (id, newData) => {
//   return new Promise((resolve, reject) => {});
// };
module.exports = { CartItem };
