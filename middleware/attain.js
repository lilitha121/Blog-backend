const Blog  = require("../models/blog");

getBlogs = async (req, res, next) => {
  let blogs;
  try {
    blogs = await Blog.findById(req.params._id);
    if (blogs == null) {
      return res.status(404).json({ message: "cannot find movie" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.blogs = blogs;
  req.eachBlog = decoded.eachBlog;
  next();
};

module.exports = getBlogs;
