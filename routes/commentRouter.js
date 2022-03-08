const express = require("express");
const router = express.Router();

const commentQueries = require("../queries/commentQueries");

// comments entry point
router.get("/", (req, res, next) =>
  commentQueries
    .getAllComments()
    .then((comments) => res.send(comments))
    .catch((e) => res.status(400).send({ error: "Could not fetch comments" }))
);

// Get ALL comments for current blog post
router.get("/:blog_id", (req, res) =>
  commentQueries
    .getAllCommentsForBlog(req.params.blog_id)
    .then((comments) => res.send(comments))
    .catch((e) => res.status(400).send({ error: "Could not fetch comments" }))
);

// Add comment for current blog post
router.post("/:blog_id", (req, res, next) => {
  const { comment_author, comment_text } = req.body;
  if (!comment_author || !comment_text)
    res
      .status(400)
      .send({ error: "Not all data submitted. Failed to comment on blog" });

  commentQueries
    .createComment(req.params.blog_id, comment_author, comment_text)
    .then((msg) => commentQueries.getAllCommentsForBlog(req.params.blog_id))
    .then((comments) => res.send(comments))
    .catch((e) =>
      res.status(400).send({ error: "Could not create comment. Query failure" })
    );
});

// Update comment on current blog
router.put("/:blog_id/:comment_id", (req, res, next) => {
  const { comment_text } = req.body;
  commentQueries
    .updateComment(req.params.comment_id, comment_text)
    .then((msg) => getAllCommentsForBlog(req.params.blog_id))
    .then((comments) => res.send(comments))
    .catch((e) => res.status(400).send({ error: "Could not update comment" }));
});

// Delete Comment
router.delete("/:blog_id/:comment_id", (req, res, next) => {
  commentQueries
    .deleteComment(req.params.comment_id)
    .then((msg) => commentQueries.getAllCommentsForBlog(req.params.blog_id))
    .then((comments) => res.send(comments))
    .catch((e) => res.status(400).send({ error: "Could not delete comment" }));
});

module.exports = router;
