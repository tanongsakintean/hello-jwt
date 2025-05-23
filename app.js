const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
require('dotenv').config()

const cors = require("cors");
let corsOptions = {
  origin: 'localhost' 
};
app.use(cors(corsOptions));

let token = "";
let secretKey = process.env.SECRET_KEY;

app.use(express.json());
app.get("/", (req, res) => res.json({ message: "Hello JWT" }));

app.post("/login", (req, res) => {
  console.log(req.body);
  const payload = {
    id: 1,
    username: req.body.username,
    password: req.body.password,
    role: "admin",
  };
  token = jwt.sign(payload, secretKey, { expiresIn: "5m" });

  res.json({ payload, token });
});
app.get("/token", (req, res) => {
  res.json({
    token,
  });
});

app.get("/protected", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  try {
    const decoded = jwt.verify(token, secretKey);

    res.json({
      message: "Hello! You are authorized",
      decoded,
    });
  } catch (error) {
    res.status(401).json({
      message: "Unauthorized",
      error: error.message,
    });
  }
});

app.disable("x-powered-by");

module.exports = app
