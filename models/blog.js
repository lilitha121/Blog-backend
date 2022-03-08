const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  img: {
    type: Object,
    required: true,
  },
});

module.exports = mongoose.model("Blog", blogSchema);
