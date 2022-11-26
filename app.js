require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const _ = require("lodash");

const authModel = require("./src/schemas/auth");
const indexRouter = require("./src/routes/index");
const branchesRouter = require("./src/routes/branches");
const mechanicRouter = require("./src/routes/mechanic");

const { MONGO_URI, MONGO_DEBUG } = process.env;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection
  .on("open", () => console.log("Mongo connection is open"))
  .on("close", () => console.log("Mongo connection is closed"))
  .on("error", (error) => {
    console.log(error);
    process.exit();
  });

mongoose.set("debug", MONGO_DEBUG);

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(async (req, res, next) => {
  const header = req.headers.authorization || "";

  if (header) {
    const headerData = Buffer.from(header.split(" ")[1], "base64")
      .toString()
      .split(":");

    if (_.size(headerData) === 2) {
      const response = await authModel.findOne({
        username: headerData[0],
        password: headerData[1],
        status: true,
      });

      if (response) {
        next();
      } else {
        res.status(401).send("Incorrect authentication user");
      }
    } else {
      res.status(401).send("Authentication is required");
    }
  } else {
    res.status(401).send("Authentication is required");
  }
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/branches", branchesRouter);
app.use("/mechanic", mechanicRouter);

module.exports = app;
