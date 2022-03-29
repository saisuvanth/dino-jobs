const path = require("path");
require('dotenv').config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookie=require('cookie-parser');
const viewRouter = require("./Routes/viewRouter");
const userRouter = require("./Routes/userRouter");

const app = express();

app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(cookie());
app.use(express.static(path.join(__dirname, "public")));

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
app.use(cors());

app.use("/", viewRouter);
app.use('/',userRouter);


module.exports = app;
