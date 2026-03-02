const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    userInfo: {
      fullName: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        discountPercentage: {
          type: Number,
          default: 0,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    paymentMethod: {
      type: String,
      enum: ["cod", "bank_transfer", "momo"],
      default: "cod",
    },
    totalPrice: { type: Number, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);
