const path = require("path");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookie = require("cookie-parser");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, { debug: true });
const viewRouter = require("./Routes/viewRouter");
const userRouter = require("./Routes/userRouter");
const interviewRouter = require("./Routes/interviewRouter");
const { initSockets } = require("./controllers/interviewHandler");
initSockets(io);
io.on('connection', () => {
    console.log("connected")
})

app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(cookie());
app.use(express.static(path.join(__dirname, "public")));
app.use("/peerjs", peerServer);

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
app.use(cors());

app.use("/", viewRouter);
app.use("/", userRouter);
app.use("/", interviewRouter);

module.exports = app;
