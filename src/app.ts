import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./app/index.routes.js";

const app: Application = express();

// CORS configuration
const allowedOrigins = [
  "http://localhost:3000",
  "https://cgrove.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      
      // In development, allow all origins
      if (process.env.NODE_ENV === "development") {
        return callback(null, true);
      }
      
      // In production, check against whitelist
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Handle preflight requests for all routes
// ✅ FIXED: Use proper syntax instead of "*"
// app.options("/:path(*)", cors());

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", routes);

export default app;