import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./app/index.routes.js";

const app: Application = express();

// Cookie parser FIRST
app.use(cookieParser());

// CORS - Make sure localhost:3000 is included
const allowedOrigins = [
  "http://localhost:3000",
  "https://cgrove.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      console.log("Request from origin:", origin); // Debug log
      
      // Allow requests with no origin (Postman, mobile apps)
      if (!origin) return callback(null, true);
      
      // In development, allow all origins
      if (process.env.NODE_ENV === "development") {
        return callback(null, true);
      }
      
      // In production, check whitelist
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cache-Control"],
    exposedHeaders: ["Set-Cookie"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", routes);

export default app;