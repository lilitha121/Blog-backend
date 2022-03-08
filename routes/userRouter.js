const express = require("express");
const router = express.Router();

const userQueries = require("../queries/userQueries");

// Get all users
router.get("/", (req, res) => {
  userQueries.getAllUsers().then((users) => res.send(users));
});

// Get single user
router.get("/:id", (req, res) => {
  userQueries.getSingleUser(req.params.id).then((user) => res.send(user[0]));
});

// Register Users
router.post("/", (req, res, next) => {
  const { name, email, contact, password } = req.body;
  if (!name || !email || !contact || !password)
    res
      .status(400)
      .send({ msg: "Not all required fields have been submitted" });
  else
    userQueries
      .registerUser(name, email, contact, password)
      .then((registration) => userQueries.getSingleUser(registration.user_id))
      .then((user) => res.send(user[0]))
      .catch((err) =>
        res
          .status(400)
          .send({ error: "User already registered, please log in: \n" + err })
      );
});

// Sign in user
router.patch("/", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    res
      .status(400)
      .send({ msg: "Not all required fields have been submitted" });

  userQueries
    .signInUser(email, password)
    .then((user) => res.send(user[0]))
    .catch((err) => res.status(404).send({ error: "User not found" }));
});

// Update Profile
router.put("/:id", (req, res) => {
  const { name, email, contact, password, avatar, about } = req.body;
  userQueries
    .updateUser(req.params.id, name, email, contact, password, avatar, about)
    .then((msg) => userQueries.getSingleUser(req.params.id))
    .then((user) => res.send(user))
    .catch((err) => res.status(404).send(err));
});

// Delete Profile
router.delete("/:id", function (req, res, next) {
  userQueries
    .deleteUser(req.params.id)
    .then((msg) => res.send(msg))
    .catch((err) => res.status(404).send(msg));
});

module.exports = router;
