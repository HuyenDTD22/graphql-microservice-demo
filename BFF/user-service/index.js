const express = require("express");
const cors = require("cors");

const database = require("./config/database");
const userRoutes = require("./routes/user.route");

database.connect();

const app = express();
app.use(cors());

app.use(express.json());
app.use("/users", userRoutes);

app.listen(4001, () => {
  console.log("User Service running on port 4001");
});
