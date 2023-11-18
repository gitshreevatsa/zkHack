const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const User = require("./schema");
const db = require("./dbConfig");

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.options("*", cors());

db();
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// second request if user doesn't exist then register
app.post("/api/register", async (req, res) => {
  console.log(req.body);
  // add to database
  const newUser = await User.create(req.body);
  console.log(newUser);
  res.status(200).json({
    message: "User created successfully",
    user: newUser,
  });
});

// first request to check if user exists , if yes, go to profile page button
// also the request to query with APIkey to get subscribtion details to pay etc
app.get("/api/login", async (req, res) => {
  const user = await User.findOne(req.query);

  res.status(200).json({
    user: user,
    exists: user ? true : false,
  });
});

app.patch("/api/update/:id/:subscriberAddress", async (req, res) => {
  const user = await User.findOne({ apiKey: req.params.id });
  console.log(user);
  user.subscribers.push(req.params.subscriberAddress);
  user.totalTransactions = user.totalTransactions + 1;
  user.totalAmount = user.totalAmount + user.amount;
  user.totalUsers = user.totalUsers + 1;
  await user.save();

  res.status(200).json({
    message: "User updated successfully",
    user: user,
  });
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
