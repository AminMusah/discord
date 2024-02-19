const express = require("express");
const socket = require("socket.io");

const userRoute = require("../routes/profile");
const authRoute = require("../routes/auth");
const serverRoute = require("../routes/server");
const channelRoute = require("../routes/channel");
const memberRoute = require("../routes/member");
const messageRoute = require("../routes/directMessage");
const conversationRoute = require("../routes/conversation");

const app = express();
require("../db/connect");

const cors = require("cors");

app.use(cors());

//send json data
app.use(express.json());

//routes
app.use("/api/", userRoute);
app.use("/api/", authRoute);
app.use("/api/", serverRoute);
app.use("/api/", channelRoute);
app.use("/api/", memberRoute);
app.use("/api/", messageRoute);
app.use("/api/", conversationRoute);

const PORT = process.env.PORT || 8000;

app.listen(PORT, console.log(`listening on port ${PORT}`));
