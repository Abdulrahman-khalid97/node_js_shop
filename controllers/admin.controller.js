const { render } = require("ejs");
const Product = require("../models/products.model");
const validationResult = require("express-validator").validationResult;
const mongoose = require("mongoose");
const config=require('../configurations/db/db.config')
const DB_URL = "mongodb://127.0.0.1:27017/shop";
const { CartItem } = require("../models/cart.model");
const { User } = require("../models/auth.model");

exports.getAdd = (req, res, next) => {
  res.render("add-product", {
    validationErrors: req.flash("validationsErrors"),
    isUser: true,
    isAdmin: true,
  });
};

exports.getManageOrder = (req, res, next) => {
  try {
    mongoose
      .connect(config.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(async () => {
        console.log("Connected to MongoDB successfully");
        const users = await User.find();
        const cartItems = await CartItem.find();

        mongoose.connection.close();
        //    console.log("Cart Render :", cartItems);
        return res.render("manage-order", {
          orderItems: cartItems.filter(
            (data) => data.status === "order" ),
          sentItems:cartItems.filter(
            (data) =>data.status === "sent"),
            complateItems:cartItems.filter(
              (data) =>data.status === "complate"),
          isUser: req.session.userId,
          users: users,
          isAdmin: req.session.isAdmin,
          quantityError: req.flash("quantityFlashError")[0],
          validationErrors: req.flash("validationErrors")[0],
        });
      })
      .catch((error) => {
        mongoose.connection.close();
        console.error("Error connecting to MongoDB:", error);
      });
  } catch (err) {
    mongoose.connection.close();
    console.log("There is error with cart page ");
  }
};
exports.sentOrder = async (req, res, next) => {
   await mongoose
    .connect(config.DB_URL)
    .then(() => {
      let result = CartItem.updateOne(
        { _id: req.body.cartId },
        {
          status: "sent",
        }
      ).then(() => {
        return;
      });
    })
    .then(() => {
      res.redirect("/admin/manage-order");
    })
    .catch((err) => {
      console.log("Edit Items Error : ", err);
    });
  
};


exports.complate = async (req, res, next) => {
  await mongoose
   .connect(config.DB_URL)
   .then(() => {
     let result = CartItem.updateOne(
       { _id: req.body.cartId },
       {
         status: "complate",
       }
     ).then(() => {
       return;
     });
   })
   .then(() => {
     res.redirect("/admin/manage-order");
   })
   .catch((err) => {
     console.log("Edit Items Error : ", err);
   });
 
};
exports.postAdd = (req, res, next) => {
  console.log(req.flash("validationErrors"));
  if (validationResult(req).array().length != 0) {
    req.flash("validationErrors", validationResult(req).array());
    res.render("add-product", {
      validationErrors: req.flash("validationErrors"),
      isUser: true,
      isAdmin: true,
    });
  } else {
    console.log(req.file);
    mongoose
      .connect(config.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(async () => {
        let product = Product({
          name: req.body.name,
          price: req.body.price,
          category: req.body.category,
          description: req.body.description,
          image: req.file.filename,
        });
        return product.save();
      })
      .then(() => {
      
        res.render("add-product", {
          validationErrors: req.flash("validationsErrors"),
          isUser: true,
          isAdmin: true,
        });
      });
  }
};
