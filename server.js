require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

app.use(express.json());
app.use(cors());
const blogsRouter = require("./routes/blogs");
app.use("/blogs", blogsRouter);

const userRouter = require("./routes/userRouter");
app.use("/user", userRouter);

const commentRouter = require("./routes/commentRouter");
app.use("/comments", commentRouter);

app.listen(process.env.PORT || 3000, () => console.log("Server Started"));
