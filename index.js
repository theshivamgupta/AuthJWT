const express = require("express");
const app = express();
const authRoute = require("./routes/auth");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  () => console.log("Connected to be DB")
);

app.use(express.json());

//middlewares
app.use("/api/user", authRoute);

app.listen(3000, () => console.log("Server is up and running"));
