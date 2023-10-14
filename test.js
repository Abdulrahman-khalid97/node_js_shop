const express = require("express");
const app = express();
const mongoose = require("mongoose");

const DB_URL = "mongodb://127.0.0.1:27017/shop";

const productSchema = mongoose.Schema({
  name: String,
  image: String,
  price: Number,
  description: String,
  category: String,
});
const Product = mongoose.model("product", productSchema); //name of model => product

mongoose
  .connect(DB_URL, { autoIndex: true })
  .then(() => {
    console.log("Connected Succefully !");
  })
  .catch((err) => {
    console.log("Error in conect to DB :", err);
  });

const getAllP = async (req, res, next) => {
  try {
    const p = await Product.find({});
    res.json(p);
  } catch (err) {
    console.log("Eneral server error", err);
  }
};
app.get("/", getAllP);

console.log(mongoose.connection);
app.listen(4000, () => {
  console.log("4000");
});
