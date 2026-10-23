import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import "dotenv/config";
import http from "http";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import socialRoutes from "./routes/social.routes.js";
import passwordRoutes from "./routes/password.routes.js";

import { Socket } from "./socket/socket.js";

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  "https://nexus-tan-phi.vercel.app",
];

// Express CORS
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.options(
  /.*/,
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

// Initialize Socket.IO once
const io = Socket(server);
app.set("io", io);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB connected:", mongoose.connection.name);
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// Routes
app.use("/", authRoutes);
app.use("/", userRoutes);
app.use("/", postRoutes);
app.use("/", socialRoutes);
app.use("/", passwordRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err);

  return res.status(400).json({
    message: err.message,
  });
});

// Test route
app.get("/randomroute", (req, res) => {
  io.emit("randomRouteHit", "Someone just hit the randomroute route!");

  res.status(200).json({
    message: "hmm!!!",
  });
});

// Start server
const PORT = process.env.PORT || 1111;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
