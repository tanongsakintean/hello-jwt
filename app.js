const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();

var cors = require("cors");
app.use(cors());

let token = "";
let secretKey = "1234";

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
  const token = req.headers.authorization.split(" ")[1];

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

app.listen(5001, () => console.log("Application is running on port 5001"));
