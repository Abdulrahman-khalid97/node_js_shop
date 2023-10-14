const express = require("express");
const app = express();
const path = require("path");
const authRouter = require("./routes/auth.route");
const homeRouter = require("./routes/home.route");
const productRouter = require("./routes/product.route");
const cartRouter = require("./routes/cart.route");
const ordersRouter = require("./routes/orders.route");
const adminRouter = require("./routes/admin.route");
const config = require("./configurations/app/app.config");
const mongoose = require("mongoose");
const DB_URL = "mongodb://127.0.0.1:27017/shop";

// to deal with session
const session = require("express-session");
const SessionStore = require("connect-mongodb-session")(session);
// connect flush
const flash = require("connect-flash");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// user folder assets at statics file
app.use(express.static(path.join(__dirname, "assets")));
app.use(express.static(path.join(__dirname, "images")));

/*--------------------------Start Session Code-----------------------------*/
// session
const STORE = new SessionStore({
  uri: "mongodb://127.0.0.1:27017/shop",
  collection: "sessions", // collection to save session
});
app.use(
  session({
    secret: "this is my secret secret to hash session",
    saveUninitialized: false,
    resave: false, // Set resave option to false
    // cookie: {
    //   maxAge: 1 * 60 * 60 * 100,
    // },
    store: STORE,
  })
);
app.use(flash());
// end session
/*---------------------------End Session Code---------------------------------- */

/*----------------------------EJS---------------------------------*/
// user view engine ejs for embadded js
app.set("view engine", "ejs");
// set default folder for view
app.set("views", "views");
/*-------------------------------------------------------------*/

/*-------------------------- Use Router -----------------------------------*/
// use auth router for authentication router
app.use("/", authRouter);
// homoe page Router

app.use("/", homeRouter);

// product Router
app.use("/product", productRouter);
// cart router
app.use("/cart", cartRouter);
// orders router
app.use("/orders", ordersRouter);
// admin router
app.use("/admin", adminRouter);
// manage Order
/*-------------------------------------------------------------*/

app.listen(config.PORT, (err) => {
  console.log(err);
  console.log(`server listen on port ${config.PORT}`);
});

// defaut page for website
// app.get("/", (req, res, next) => {
//   res.render("index");
// });
// mongoose
//   .connect(DB_URL, { autoIndex: true })
//   .then(() => {
//     console.log("Connected Succefully !");
//   })
//   .catch((err) => {
//     console.log("Error in conect to DB :", err);
//   });
