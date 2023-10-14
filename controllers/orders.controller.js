const validationResult = require("express-validator").validationResult;
const { CartItem } = require("../models/cart.model");
const mongoose = require("mongoose");
const { Result } = require("express-validator");
const DB_URL = "mongodb://127.0.0.1:27017/shop";

exports.getOrders = (req, res, next) => {
  try {
    mongoose
      .connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(async () => {
        console.log("Connected to MongoDB successfully");

        const cartItems = await CartItem.find(
          { userId: req.session.userId },
          {},
          { sort: { timeStamp: 1 } }
        );
        mongoose.connection.close();
        //    console.log("Cart Render :", cartItems);
        return res.render("orders", {
          cartItems: cartItems.filter((data) => data.status === "order"),
          isUser: req.session.userId,
          isAdmin: req.session.isAdmin,
          quantityError: req.flash("quantityFlashError")[0],
          validationErrors: req.flash("validationErrors")[0],
        });
      })
      .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
      });
  } catch (err) {
    console.log("There is error with cart page ");
  }
  // res.render("orders", {
  //   cartItems:[],
  //   isUser: req.session.userId,
  //   isAdmin: req.session.isAdmin,
  // });
};

exports.unOrder = (req, res, next) => {
  mongoose
    .connect(DB_URL)
    .then(() => {
      let result = CartItem.updateOne(
        { _id: req.body.cartId },
        {
          status: "pending",
        }
      ).then(() => {
        return;
      });
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      console.log("Edit Items Error : ", err);
    });
};
