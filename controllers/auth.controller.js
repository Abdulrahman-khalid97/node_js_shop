const authModel = require("../models/auth.model");
const validationResult = require("express-validator").validationResult;

exports.getSignUp = (req, res, next) => {
  res.render("signup", {
    validationErrors: req.flash("validationErrors"),
    isUser: false,
    isAdmin: false,
  });
};

exports.postSignUp = (req, res, next) => {
  if (validationResult(req).isEmpty()) {
    authModel
      .createNewUser(req.body.username, req.body.email, req.body.password)
      .then(() => {
        console.log("added");
        res.redirect("/login");
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/singup");
      });
  } else {
    req.flash("validationErrors", validationResult(req).array());
    console.log(validationResult(req).array());
    res.redirect("signup");
  }
};

exports.getLogin = (req, res, next) => {
  // req.flash('authError' , err);
  res.render("login", {
    authError: req.flash("authError"),
    validationErrors: req.flash("validationErrors"),
    isUser: false,
    isAdmin: false,
  });
};

exports.postLogin = (req, res, next) => {
  if (validationResult(req).isEmpty()) {
    authModel
      .loginUser(req.body.email, req.body.password)
      .then((resolve) => {
        req.session.userId = resolve.id;
        req.session.isAdmin = resolve.isAdmin;
        console.log("Auth Model : ", id);
        res.redirect("/");
      })
      .catch((err) => {
        req.flash("authError", err);
        res.redirect("/login");
        // console.log(err);
      });
  } else {
    req.flash("validationErrors", validationResult(req).array());
    console.log(validationResult(req).array());
    res.redirect("login");
  }
};

exports.logout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};
