const express = require("express");

const app = express();
const cors = require("cors");

const userController = require("./controllers/auth.controller");

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use("", userController);

module.exports = app;
