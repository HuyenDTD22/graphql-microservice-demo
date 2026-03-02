const express = require("express");
const router = express.Router();
const axios = require("axios");
const Order = require("../models/order.model");

// Lấy order theo userId
router.get("/", async (req, res) => {
  const { userId } = req.query;
  const orders = await Order.find({ userId });
  res.json(orders);
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
    const { userId, userInfo, items, paymentMethod } = req.body;

    if (!userId || !items?.length)
      return res.status(400).json({ message: "Invalid data" });

    // Lấy toàn bộ product song song
    const products = await Promise.all(
      items.map((i) =>
        axios.get(`http://localhost:4003/products/${i.productId}`),
      ),
    );

    let totalPrice = 0;

    const orderItems = items.map((item, index) => {
      const price = products[index].data.price;
      const discount = item.discountPercentage || 0;

      const finalPrice = price * (1 - discount / 100);
      totalPrice += finalPrice * item.quantity;

      return {
        productId: item.productId,
        price,
        discountPercentage: discount,
        quantity: item.quantity,
      };
    });

    const order = await Order.create({
      userId,
      userInfo,
      items: orderItems,
      paymentMethod,
      totalPrice,
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: "Error creating order" });
  }
});

module.exports = router;
