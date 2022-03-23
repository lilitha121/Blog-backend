const express = require("express");
const router = express.Router();
const blogModels = require("../models/blog")

// Get all blog posts
router.get("/", async (req, res) => {
    try {
      const blogs = await blogModels.find();
      res.json(blogs);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});

// Get single Blog
router.get("/:id", getBlogs, (req, res) => {
  res.send(req.blogs);
});

// Create Blog
router.post("/", async (req, res) => {
  const blogs = new blogModels({
    title: req.body.title,
    price: req.body.price,
    content: req.body.content,
    img: req.body.img,
  });
  try {
    const newBlog = await blogs.save();
    res.status(201).json(newBlog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update blog
router.patch("/:id", getBlogs, async (req, res) => {
  if (req.body.title != null) {
    res.blogs.title = req.body.title;
  }
  if (req.body.price != null) {
    res.blogs.price = req.body.price;
  }
  if (req.body.content != null) {
    res.blogs.content = req.body.content;
  }
  if (req.body.img != null) {
    res.blogs.img = req.body.img;
  }
  try {
    const updatedBlog = await res.blogs.update();
    res.json(updatedBlog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete Blog
router.delete("/:id", getBlogs, async (req, res) => {
  try {
    await res.blogs.remove();
    res.json({ message: "Blog Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getBlogs(req, res, next) {
  let blogs;
  try {
    blogs = await blogModels.findById(req.params.id);
    if (blogs == null) {
      return res.status(404).json({ message: "Cannot find blog" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.blogs = blogs;
  next();
}
module.exports = router;
