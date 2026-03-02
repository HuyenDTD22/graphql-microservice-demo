const express = require("express");
const cors = require("cors");

const database = require("./config/database");
const productRoutes = require("./routes/product.route");

database.connect();

const app = express();

app.use(cors());

app.use(express.json());

app.use("/products", productRoutes);

app.listen(4003, () => {
  console.log("Product Service running on port 4003");
});
