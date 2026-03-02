const express = require("express");
const router = express.Router();
const Order = require("../models/order.model");

// Lấy order theo userId
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: "Thiếu userId" });
    const orders = await Order.find({ userId });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});

// Lấy order theo id
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Error fetching order" });
  }
});

// Tạo order
router.post("/", async (req, res) => {
  try {
    const { userId, userInfo, items, paymentMethod, totalPrice } = req.body;

    if (!userId || !items?.length)
      return res.status(400).json({ message: "Invalid data" });

    const order = await Order.create({
      userId,
      userInfo,
      items,
      paymentMethod,
      totalPrice,
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: "Error creating order" });
  }
});

module.exports = router;
