const path = require("node:path")
const express = require("express");
const logger = require("morgan");
const cors = require("cors");

require("dotenv").config();

const contactsRouter = require("./routes/api/contacts");
const userRouter = require("./routes/api/auth");
const avatarRouter = require("./routes/api/users");


const auth = require("./middlewares/auth");

const app = express();

app.use("/avatars", express.static(path.join(__dirname, "public", "avatars")))

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());



app.use("/api/contacts", auth, contactsRouter);
app.use("/users", userRouter, auth, avatarRouter);
// app.use("/users", auth, avatarRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;
