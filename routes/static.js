const express = require("express");
const router = express.Router();
const joi = require("joi");
const models = require("../models/users");

router.post("/login", async (req, res) => {
  try {
    const schema = joi.object().keys({
      email: joi.string().email().required(),
      password: joi.string().min(8).max(20).required(),
    });
    const result = schema.validate(req.body);
    if (result.error) {
      throw result.error.details[0].message;
    }
    let checkUserLogin = await models.verifyUser(result.value);
    if (checkUserLogin.error) {
      throw checkUserLogin.message;
    }

    // Set session for logged in user
    req.session.user = {
      name: checkUserLogin.data.name,
      email: checkUserLogin.data.email,
    };
    res.json(checkUserLogin);
  } catch (err) {
    res.json({ error: true, message: err });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const schema = joi.objects().keys({
      name: joi.string().required(),
      email: joi.string().email().required(),
      password: joi.string().min(8).max(20).required(),
    });

    const result = schema.validate(req.body);
    if (result.error) {
      throw result.error.details[0].message;
    }
    let addUserResponse = await models.addUser(result.value);
    res.json(addUserResponse);
  } catch (err) {
    res.json({ error: true, message: err });
  }
});

router.get("/logout", async (req, res) => {
  if (req.session.user) {
    req.session.destroy();
  }
  res.redirect("/");
});

module.exports = router;
