const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const userRoute = require("../routes/profile");
const authRoute = require("../routes/auth");
const serverRoute = require("../routes/server");
const channelRoute = require("../routes/channel");
const memberRoute = require("../routes/member");
const messageRoute = require("../routes/directMessage");
const messagesRoute = require("../routes/message");
const conversationRoute = require("../routes/conversation");
const liveKitRoute = require("../routes/livekit");
const agentRoute = require("../routes/agent");

const app = express();

const server = http.createServer(app);

require("../db/connect");

const cors = require("cors");
const { initializeSocket } = require("../middleware/socket");

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
app.use("/api/", messagesRoute);
app.use("/api/", conversationRoute);
app.use("/api/", liveKitRoute);
app.use("/api/", agentRoute);

initializeSocket(server);

const PORT = process.env.PORT || 8000;

// Start the server
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
