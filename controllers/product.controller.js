
const Product = require("../models/products.model");
const mongoose = require("mongoose");
const DB_URL = "mongodb://127.0.0.1:27017/shop";

exports.getProduct=(req , res , next)=>{

    let id= req.params.id;
    try {
        mongoose
          .connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
          .then(async () => {
            console.log("Connected to MongoDB successfully");
  
            const product = await Product.findById(id);
            mongoose.connection.close();
            return res.render("product", {
              product: product,
              isUser: req.session.userId,
              isAdmin:req.session.isAdmin,
              validationErrors: req.flash("validationErrors")[0],
            });
         
          })
          .catch((error) => {
            console.error("Error connecting to MongoDB:", error);
          });
      } catch (err) {
        console.log("Internal Server Error: ", err);
      }
} 