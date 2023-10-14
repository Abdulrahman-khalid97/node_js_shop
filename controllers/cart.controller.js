const { render } = require("ejs");
const validationResult = require("express-validator").validationResult;
const { CartItem } = require("../models/cart.model");
const mongoose = require("mongoose");
const { Result } = require("express-validator");
const DB_URL = "mongodb://127.0.0.1:27017/shop";

exports.getCart = (req, res, next) => {
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
        return res.render("cart", {
          cartItems: cartItems.filter((data) => data.status === "pending"),
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
};

exports.postCart = (req, res, next) => {
  console.log("there is an error", validationResult(req));
  if (validationResult(req).isEmpty()) {
    mongoose
      .connect(DB_URL)
      .then(async () => {
        await CartItem.findOne({
          userId: req.session.userId,
          productId: req.body.productId,
          status: "pending",
        }).then(async (result) => {
          if (result) {
            await CartItem.updateOne(
              { productId: req.body.productId },
              { quantity: Number(result.quantity) + Number(req.body.quantity) }
            ).then(() => {
              return;
            });
          } else {
            let item = new CartItem({
              name: req.body.name,
              price: req.body.price,
              quantity: req.body.quantity,
              userId: req.session.userId,
              productId: req.body.productId,
              timeStamp: Date.now(),
            });
            return item.save();
          }
        });
      })
      .then(() => {
        mongoose.disconnect();
        res.redirect("/");
      })
      .catch((err) => {
        mongoose.disconnect();
        res.redirect("/");
      });
  } else {
    console.log("ther is an error  empty");
    req.flash("validationErrors", validationResult(req).array());
    //console.log("redirect in to : ", req.body.redirectTo);
    res.redirect("/");
  }
};

exports.postSaveCart = (req, res, next) => {
  if (validationResult(req).isEmpty()) {
    mongoose
      .connect(DB_URL)
      .then(() => {
        let result = CartItem.updateOne(
          { _id: req.body.cartId },
          {
            quantity: req.body.quantity,
            timeStamp: new Date(),
          }
        ).then(() => {
          return;
        });
      })
      .then(() => {
        res.redirect("/cart");
      })
      .catch((err) => {
        console.log("Edit Items Error : ", err);
      });
  } else {
    req.flash("quantityFlashError", validationResult(req).array());
    console.log(validationResult(req).array());
    res.redirect("/cart");
  }
};
exports.addInToOrders = (req, res, next) => {
  mongoose
    .connect(DB_URL)
    .then(() => {
      let result = CartItem.updateOne(
        { _id: req.body.cartId },
        {
          status: "order",
        }
      ).then(() => {
        return;
      });
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log("Edit Items Error : ", err);
    });
};
exports.postDeleteItemCart = (req, res, next) => {
  if (validationResult(req).isEmpty()) {
    mongoose
      .connect(DB_URL)
      .then(() => {
        let result = CartItem.findByIdAndDelete(req.body.cartId).then(() => {
          return;
        });
      })
      .then(() => {
        res.redirect("/cart");
      })
      .catch((err) => {
        console.log("Edit Items Error : ", err);
      });
  } else {
    res.redirect("/cart");
  }
};
