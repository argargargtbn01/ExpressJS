const { Router } = require("express");
const UserModel = require("../models/User");
const userRouter = Router();

// create user
userRouter.post("/", (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  UserModel.findOne({
    username: username,
  })
    .then((data) => {
      if (data) {
        res.json("user da ton tai");
        return;
      } else {
        return UserModel.create({
          username: username,
          password: password,
        });
      }
    })
    .then((data) => {
      if (data) {
        res.json("tao tai khoan thanh cong");
      }
    })
    .catch((err) => {
      res.status(500).json("tao tai khoan that bai");
    });
});

module.exports = userRouter;
