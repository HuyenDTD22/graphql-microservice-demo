const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: String,
    gender: String,
    address: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
