const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const connectDB = require("./config/db");
const { Schema, model } = require("mongoose");
const userDetails = require("./schemas/userDetails");

//middleware
app.use(express.json());
app.use(cors());

//load config
dotenv.config({ path: "./config/config.env" });

//calling module for connecting to db
connectDB();

//password hashing
const hashed = async (password) => {
  try {
    console.log(`user normal pw: ${password}`);
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(`Hashed pw version: ${hashedPassword}`);
    return hashedPassword;
  } catch (err) {
    console.log("Bcrypt error: " + err.message);
  }
};

// POST for registration
app.post("/api/register", async (req, res) => {
  try {
    const hashedPassword = await hashed(req.body.password);
    const newUser = await userDetails.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    console.log("new user details: " + newUser);
    res.status(201).json({ message: "All good data is received" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Error registering user", error: err.message });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    console.log(req.body);
    res.status(200).send("User should be able to login");
    const username = await req.body.username;
  } catch (err) {
    res.status(500).json({ message: "error logging in: ", error: err.message });
  }
});

//starting server
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
