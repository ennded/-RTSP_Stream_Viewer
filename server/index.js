require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const streamRoutes = require("./routes/streamRoutes");

const app = express();
const server = http.createServer(app);

// Use CLIENT_URL from env or fallback
const CLIENT_URL = process.env.CLIENT_URL || "http://192.168.1.108:3000";
console.log("CORS allowed origin:", CLIENT_URL);

// Setup Socket.IO with proper CORS config matching express

const allowedOrigins = [
  "http://localhost:3000",
  process.env.CLIENT_URL, // your frontend URL from env
  "https://rtsp-stream-viewer-theta.vercel.app",
].filter(Boolean);

const io = socketIo(server, {
  cors: {
    origin: function (origin, callback) {
      // allow requests with no origin (like curl/postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
  allowEIO3: true,
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Use CORS middleware with exact same origin as Socket.IO
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

// No need to manually set headers, cors middleware handles it

app.use(express.json());

// Routes
app.use("/api/streams", streamRoutes(io));

// Socket.IO event handling
io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on("join", (streamId) => {
    socket.join(streamId);
    console.log(`Client ${socket.id} joined stream ${streamId}`);
  });

  socket.on("leave", (streamId) => {
    socket.leave(streamId);
    console.log(`Client ${socket.id} left stream ${streamId}`);
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
