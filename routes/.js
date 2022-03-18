const express = require("express");
const verifyToken = require("../middleware/authJwt");
const User = require("../models/users");
const getBlogs = require("../middleware/attain");
const router = express.Router();
const jwt = require("jsonwebtoken");
const blogModels = require("../models/movie");

router.get("/", [verifyToken, getUser], (req, res) => {
  return res.send(res.user.cart);
});

router.post("/:id", [verifyToken, getUser], async (req, res) => {
  let blog = await blogModels.findById(req.params.id).lean();
  let qty = req.body.qty;
  let singleBlog = res.user.singleBlog;
  let added = false;
  singleBlog.forEach((item) => {
    if (item._id.valueOf() == blog._id.valueOf()) {
      item.qty += qty;
      added = true;
    }
  });

  if (!added) {
    singleBlog.push({ ...blog, qty });
  }
  try {
    res.user.singleBlog = singleBlog;

    let token = jwt.sign(
      { _id: req.userId, singleBlog: res.user.singleBlog },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: 86400, // 24 hours
      }
    );
    const updatedUser = await res.user.save();
    res.status(200).json({ updatedUser, token });
  } catch (error) {
    console.log(error);
  }
});

router.put("/:id", [verifyToken, getBlogs], async (req, res) => {
  const user = await User.findById(req.user._id);
  const inSingleBlog = user.singleBlog.some((prod) => prod._id == req.params._id);

  let updatedUser;
  if (inSingleBlog) {
    const blog = user.singleBlog.find((prod) => prod._id == req.params._id);
    blog.qty += req.body.qty;
    updatedUser = await user.save();
  } else {
    user.singleBlog.push({ ...res.singleBlog, qty: req.body.qty });
    updatedUser = await user.save;
  }
  try {
    const ACCESS_TOKEN_SECRET = jwt.sign(
      JSON.stringify(updatedUser),
      process.env.ACCESS_TOKEN_SECRET
    );
    res.status(201).json({ jwt: ACCESS_TOKEN_SECRET, singleBlog: updatedUser.cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", [verifyToken, getUser], async (req, res) => {
  let singleBlog = res.user.singleBlog;
  singleBlog.forEach((cartitem) => {
    if (blogItem._id == req.params.id) {
      singleBlog = singleBlog.filter((blogItem) => blogItem._id != req.params.id);
    }
  });
  try {
    res.user.singleBlog = singleBlog;

    const updated = res.user.save();
    let token = jwt.sign(
      { _id: req.userId, singleBlog },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: 86400, // 24 hours
      }
    );
    res.json({ message: "Deleted movie", updated, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getUser(req, res, next) {
  let user;
  try {
    user = await User.findById(req.userId);
    if (user == null) {
      return res.status(404).json({ message: "Cannot find User" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.user = user;
  next();
}

module.exports = router;
