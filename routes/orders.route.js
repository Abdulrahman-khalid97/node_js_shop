const router = require("express").Router();
const bodyParser = require("body-parser");

const protection = require("./protections/auth.protections");
const check = require("express-validator").check;
const ordersController = require("../controllers/orders.controller");

router.get("/", protection.isAuth, ordersController.getOrders);
router.post("/unOrder", protection.isAuth, ordersController.unOrder);
module.exports = router;
