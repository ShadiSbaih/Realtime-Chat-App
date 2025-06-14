import express from 'express';
import authRoutes from "../routes/auth.route.js";
import messageRoutes from "../routes/message.route.js";
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import { connectDB } from "../lib/db.js"
import cors from 'cors';

const app = express();
// Middleware
app.use(cookieParser());
app.use(express.json());

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});