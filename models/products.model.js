const { MinKey } = require("mongodb");
const mongoose = require("mongoose");
const config=require('../configurations/db/db.config')

const productSchema = mongoose.Schema({
  name: String,
  image: String,
  price: Number,
  description: String,
  category: String,
});
const Product = mongoose.model("product", productSchema); //name of model => product
module.exports=Product;
