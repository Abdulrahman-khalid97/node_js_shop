const router = require("express").Router();
const bodyParser = require("body-parser");
const check = require("express-validator").check;
const multer = require("multer");
const adminController = require("../controllers/admin.controller");
const adminProtection = require("./protections/admin.protections");

const { diskStorage } = require("multer");

router.get("/add", adminProtection, adminController.getAdd);
router.post("/sent", adminProtection, adminController.sentOrder);
router.post("/complate", adminProtection, adminController.complate);
router.get("/manage-order", adminProtection, adminController.getManageOrder);

router.post(
  "/add",
  adminProtection,
  multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "images");
      },
      filename: (req, file, cb) => {
        cb(null, Date.now() + "_" + file.originalname);
      },
    }),
  }).single("image"),
  check("image").custom((value, { req }) => {
    if (req.file) return true;
    else throw "Image is required";
  }),
  bodyParser.urlencoded({ extended: true }),
  adminController.postAdd
);
module.exports = router;
