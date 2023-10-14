const router = require("express").Router();
const bodyParser = require("body-parser");
const check = require("express-validator").check;
const protection = require("./protections/auth.protections");

const authController = require("../controllers/auth.controller");
const { model } = require("mongoose");

router.get("/signup", protection.noAuth, authController.getSignUp);
router.post(
  "/signup",
  protection.noAuth,
  bodyParser.urlencoded({ extended: true }),
  check("username").not().isEmpty().withMessage("user name is required"),
  check("email").not().isEmpty().isEmail().withMessage("invalid email"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("password should be more than 6 character"),
  //  (req , res , next)=>{
  //     let valueConfirm=req.body.password;
  //     return check('confirmPassword').equals(valueConfirm);
  //  }
  check("confirmPassword").custom((value, { req }) => {
    if (value === req.body.password) {
      return true;
    } else {
      throw "password is not the same";
    }
  }),
  authController.postSignUp
);

router.get("/login", protection.noAuth, authController.getLogin);
router.post(
  "/login",
  protection.noAuth,
  bodyParser.urlencoded({ extended: true }),
  check("email").not().isEmpty().isEmail().withMessage("invalid Email"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("password should be more than 6 character"),
  authController.postLogin
);

router.all("/logout", protection.isAuth, authController.logout);
module.exports = router;
