const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const jwt = require("jsonwebtoken");

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    console.log(req.body);
    const user = new User({
      name: req.body.name,
      password: hash,
      email: req.body.email,
      post: req.body.post
    });
    user
      .save()
      .then(result => {
        console.log("user created");
        res.status(201).json({ message: "User created", result: result });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });
});

router.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      fetchedUser = user;
      let result = bcrypt.compare(req.body.password, fetchedUser.password);
      if (!result) {
        return res.status(401).json({ message: "Password not matched" });
      } else {
        const token = jwt.sign(
          { email: fetchedUser.email, userId: fetchedUser._id },
          "sercret_and_longer_string"
        );
        res.status(200).json({
          token: token,
          user: user
        });
      }
    })
    .catch(err => {
      console.log(err);
      return res.status(401).json({ message: "Auth failed" });
    });
});

router.get("/employees/:post", (req, res, next) => {
  if (req.params.post === "manager") {
    User.find({ post: "employee" }).then(users => {
      res.json({
        employees: users
      });
    });
  } else if (req.params.post === "employee") {
    User.find({ post: "manager" }).then(users => {
      res.json({
        employees: users
      });
    });
  }
});

router.get("/getCurUserInfo", checkAuth, (req, res, next) => {
  User.findById(req.userData.userId)
    .then(user => {
      return res.status(201).json({ user: user });
    })
    .catch(err => {
      console.log(err + " id not found");
    });
});

module.exports = router;
