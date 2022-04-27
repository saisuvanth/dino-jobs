require("dotenv").config();
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const cookie = require("cookie-parser");
const bodyParser = require("body-parser");
const express = require("express");
const { v4: uuidv4 } = require("uuid");
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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(cookie());
app.use(express.static(path.join(__dirname, "public")));
app.use("/peerjs", peerServer);
const { errorHandler } = require("./middleware");

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
app.use(cors());

app.use("/", viewRouter);
app.use("/", userRouter);
app.use("/", interviewRouter);

app.all('*', errorHandler);

app.use((err, req, res, next) => {
    console.log(err);
    errorHandler(err, req, res, next);
});

module.exports = server;
