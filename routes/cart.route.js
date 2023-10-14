const router = require("express").Router();
const bodyParser = require("body-parser");

const protection = require("./protections/auth.protections");
const check = require("express-validator").check;
const cartController = require("../controllers/cart.controller");

router.post(
  "/",
  protection.isAuth,
  bodyParser.urlencoded({ extended: true }),
  check("quantity").not().isEmpty().withMessage("There is no Quantity"),
  check("quantity").isInt({ min: 1 }).withMessage("Quantity not found "),
  cartController.postCart
);

router.post(
  '/save' ,
   protection.isAuth ,
 bodyParser.urlencoded({extended:true}),
 check('quantity').isInt({ min: 1 }).withMessage("Quantity must be greater than 0 "),
 cartController.postSaveCart
);
router.post(
  '/delete' ,
   protection.isAuth ,
 cartController.postDeleteItemCart
);
router.post('/addToOrders' , protection.isAuth , 
bodyParser.urlencoded({extended:true}) , 
cartController.addInToOrders)
router.get("/", protection.isAuth ,cartController.getCart);

 module.exports = router;
  
 