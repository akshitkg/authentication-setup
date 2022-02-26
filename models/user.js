const mongoose = require("mongoose");
const joi = require("joi");
const Joi = require("joi");

const User = mongoose.model(
  "user",
  new mongoose.Schema({
    name: {
      type: "string",
      required: true,
      maxLength: 100,
    },
    email: {
      type: "string",
      required: true,
      minLength: 5,
      maxLength: 255,
      unique: true,
    },
    password: {
      type: "password",
      required: true,
      minLength: 8,
      maxLength: 1000,
    },
  })
);

function validateUser(user) {
  const schema = {
    name: Joi.string().max(100).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(8).max(1000).required().password(),
  };
  return Joi.validate(user, schema);
}

exports.User=User;
exports.validate=validateUser;