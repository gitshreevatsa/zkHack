const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true },
  apiKey: { type: String, required: true, unique: true },
  totalUsers: { type: Number, default: 0 },
  totalTransactions: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
  details: { type: String , required: true},
  amount: { type: Number, default: 0, required: true },
  transactions: { type: Array, default: [] },
  subscribers: { type: Array, default: [] },
  callBackUrl : { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
