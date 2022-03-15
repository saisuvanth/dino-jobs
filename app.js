const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const viewRouter = require("./Routes/viewRouter");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
app.use(cors());

app.use("/", viewRouter);

module.exports = app;
