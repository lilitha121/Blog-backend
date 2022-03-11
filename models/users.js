const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: {
    type: Array,
    required: false,
    default: [],
  },
  phone_number: {
    type: Number,
    required: true,
  },
  join_date: {
    type: String,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
