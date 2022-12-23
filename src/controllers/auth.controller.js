require("dotenv").config();
const express = require("express");
const { uploadSingle } = require("../middleware/multer");
const { body, validationResult } = require("express-validator");

const User = require("../models/user.model");
const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });

    if (!user)
      return res
        .status(400)
        .send({ message: "Either Email or Password is incorrect." });

    return res.status(201).json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.post("/register", uploadSingle("profile_pic"), async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email }).lean().exec();

    if (user)
      return res
        .status(400)
        .send({ userexists: "User with that email already exists." });

    user = await User.create({
      email: req.body.email,
      name: req.body.name,
      mobile: req.body.mobile,
      password: req.body.password,
      profile_pic: req.file?.location,
    });

    return res.status(201).json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/user", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.patch(
  "/user/update",

  uploadSingle("profile_pic"),

  async (req, res) => {
    console.log(req.file);

    try {
      const password = req.body.curr_password;
      let user;

      if (!password) {
        user = await User.findOneAndUpdate(
          { email: req.body.email },
          {
            name: req.body.name,
            mobile: req.body.mobile,
            profile_pic: req.file?.location,
          },
          {
            new: true,
          }
        );
        return res.status(200).json(user);
      }

      user = await User.findOne({ email: req.body.email });

      if (user.password != password)
        return res.status(400).send({ message: "Password is incorrect." });

      user = await User.findOneAndUpdate(
        { email: req.body.email },
        {
          name: req.body.name,
          mobile: req.body.mobile,
          password: req.body.new_password,
          profile_pic: req.file?.location,
        },
        {
          new: true,
        }
      );

      return res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

module.exports = router;
