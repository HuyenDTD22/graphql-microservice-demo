const express = require("express");
const cors = require("cors");

const database = require("./config/database");
const orderRoutes = require("./routes/order.route");

database.connect();

const app = express();

app.use(cors());

app.use(express.json());

app.use("/orders", orderRoutes);

app.listen(4002, () => {
  console.log("Order Service running on port 4002");
});
