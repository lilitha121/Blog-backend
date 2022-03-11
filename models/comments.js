const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  join_date: {
    type: String,
    default: Date.now,
  },
});

module.exports = mongoose.model("Comment", commentSchema);
