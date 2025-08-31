import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import { Server as SocketServer } from "socket.io";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import { initSocket } from "./services/ws.js";

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: { origin: process.env.CLIENT_ORIGIN, credentials: true }
});

app.use((req, _res, next) => { req.io = io; next(); });
app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

const start = async () => {
  await connectDB(process.env.MONGO_URI);
  initSocket(io);
  const port = process.env.PORT || 4000;
  server.listen(port, () => console.log(`API on :${port}`));
};
start();
