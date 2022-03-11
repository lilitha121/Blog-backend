const express = require("express");
const comments = require("../models/comments");
const router = express.Router();
const commentModels = require("../models/comments");


// comments entry point
router.get("/", async (req, res) => {
  try {
    const comments = await commentModels.find();
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get ALL comments for current blog post
router.get("/:id", getComments, (req, res) => {
  res.send(req.comments);
});

// Add comment for current blog post
router.post("/", async (req, res) => {
  const comments = new commentModels({
    message: req.body.message,
    
  });
  try {
    const newComment = await comments.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update comment on current blog
router.patch("/:id", getComments, async (req, res) => {
  if (req.body.message != null) {
    res.comments.message = req.body.message;
  }
  try {
    const updatedComments = await res.comments.save();
    res.json(updatedComments);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete Comment
router.delete("/:id", getComments, async (req, res) => {
  try {
    await res.comments.remove();
    res.json({ message: "Comments Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getComments(req, res, next) {
  let comments;
  try {
    comments = await commentModels.findById(req.params.id);
    if (comments == null) {
      return res.status(404).json({ message: "Cannot find comment" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.comments = comments;
  next();
}

module.exports = router;
