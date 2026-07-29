const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const templateRoutes = require("./routes/templates");
const extractRoutes = require("./routes/extract");
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/templates", templateRoutes);
app.use("/api/extract", extractRoutes);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  })