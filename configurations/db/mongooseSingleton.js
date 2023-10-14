const mongoose = require("mongoose");
const { DB_URL } = require("./db.config");
class MongooseSingleton {
  constructor() {
    this.connection = null;
  }
  async connect() {
    if (!this.connection) {
      this.connection = await mongoose
        .connect(DB_URL, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
        .then(() => console.log("Connection to Mongoose successfuly !"))
        .catch((err) =>
          console.log(
            "There is an error during Connection into mongoose : ",
            err
          )
        );
    }
  }

  getDB() {
    if (!this.connection) {
      throw new Error("Mongoose connection Not establish");

      return this.connection;
    }
  }

  async close() {
    if (this.connection) {
      await this.connection.disconnect();
      this.connection = null;
    }
  }
}

const instance = new MongooseSingleton();
module.exports = instance;
