
const { render } = require("ejs");
const validationResult = require("express-validator").validationResult;
const { CartItem } = require("../models/cart.model");
const {User}=require('../models/auth.model')
const mongoose = require("mongoose");
const { Result } = require("express-validator");
const DB_URL = "mongodb://127.0.0.1:27017/shop";

