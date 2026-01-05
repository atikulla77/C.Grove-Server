import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./app/index.routes";


const app: Application = express();

// ✅ DEFINE IT FIRST
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:8081",
  "https://cgrove.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow server-to-server, Postman, curl
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// ✅ VERY IMPORTANT for preflight
app.options("*", cors());



app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", routes);

export default app;
