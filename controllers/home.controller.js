const { ConnectionStates } = require("mongoose");
// const productsModel = require("../models/products.model");
const Product = require("../models/products.model");
const mongoose = require("mongoose");
const DB_URL = "mongodb://127.0.0.1:27017/shop";

let i = 0;
const getHome = (req, res, next) => {
  let category = req.query.category;
  if (category && category != "all") {
    try {
      mongoose
        .connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(async () => {
          console.log("Connected to MongoDB successfully");

          const products = await Product.find({ category: category });
          mongoose.connection.close();
          return res.render("index", {
            products: products,
            isAdmin:req.session.isAdmin,
            isUser: req.session.userId,
            validationErrors: req.flash("validationErrors")[0],
          });
        
        })
        .catch((error) => {
          console.error("Error connecting to MongoDB:", error);
        });
    } catch (err) {
      console.log("Internal Server Error: ", err);
      res.render("index", {
        products: [],
        isAdmin:req.session.isAdmin,
        isUser: req.session.userId,
        validationErrors: req.flash("validationErrors")[0],
      });
    }
  } else {
    try {
      mongoose
        .connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(async () => {
          console.log("Connected to MongoDB successfully");
          const products = await Product.find({});
          mongoose.connection.close();
          return res.render("index", {
            products: products,
            isAdmin:req.session.isAdmin,
            isUser: req.session.userId,
            validationErrors: req.flash("validationErrors")[0],
          });
          
        })
        .catch((error) => {
          console.error("Error connecting to MongoDB:", error);
        });
    } catch (err) {
      console.log("Internal Server Error: ", err);
      res.render("index", {
        products: [],
        isAdmin:req.session.isAdmin,
        isUser: req.session.userId,
        validationErrors: req.flash("validationErrors")[0],
      });
    }
  }
};

module.exports = { getHome };
