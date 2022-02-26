const { User, validate } = require("../models/user.js");

const express = require("express");
const app = express();
const router=express.Router();

router.get('/')