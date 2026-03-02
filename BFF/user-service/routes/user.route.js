const express = require("express");
const router = express.Router();
const User = require("../models/user.model");

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  res.json(user);
});

router.post("/", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.json({ message: "Tạo tài khoản thành công!" });
});

module.exports = router;
