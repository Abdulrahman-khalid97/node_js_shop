const mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const { Db } = require("mongodb");
const config=require('../configurations/db/db.config')
const DB_URL = config.DB_URL;

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  email: String,
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("user", userSchema);
exports.User=User;
exports.createNewUser = (username, email, password) => {
  // check if email is found
  // yes or error
  //no create new account

  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL)
      .then(() => {
        return User.findOne({ email: email });
      })
      .then((user) => {
        if (user) {
          mongoose.disconnect();
          reject("email is used");
        } else {
          return bcrypt.hash(password, 10);
        }
      })
      .then((hashPassword) => {
        let user = new User({
          username: username,
          email: email,
          password: hashPassword,
        });
        return user.save();
      })
      .then(() => {
        mongoose.disconnect();
        resolve();
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};

exports.loginUser = (email, password) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL)
      .then(() => {
        return User.findOne({ email: email });
      })
      .then((user) => {
        if (!user) {
          mongoose.disconnect();
          reject("there is no user with this email");
        } else {
          bcrypt.compare(password, user.password).then((same) => {
            if (!same) {
              reject("password is not correct please retry later ");
            } else {
              mongoose.disconnect();
              resolve({
                id: user._id,
                isAdmin: user.isAdmin,
              });
            }
          });
        }
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};

