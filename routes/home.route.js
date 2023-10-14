const router = require("express").Router();
const bodyParser = require("body-parser");
const isAuth = require("./protections/auth.protections");

const homeController = require("../controllers/home.controller");

  router.get("/",homeController.getHome);

module.exports = router;
