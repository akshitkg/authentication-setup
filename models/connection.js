const mongoose = require("mongoose");
const nconf = require("nconf");
// const chalk = require("chalk");

mongoose.connect(nconf.get("mongodbURL"), {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Validate MongoDB connection
const db = mongoose.connection;

// Events
db.on("error", () => {
  console.log(`MongoDB connection error`);
});

db.once("open", (callback) => {
  console.log(
    `Connected to MongoDB Store`
  );
});

module.exports = {
  mongoConnection: db,
};
