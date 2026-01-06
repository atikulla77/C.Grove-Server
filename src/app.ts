import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./app/index.routes.js";

const app: Application = express();

// Cookie parser FIRST
app.use(cookieParser());

// CORS - Make sure localhost:3000 is included
const allowedOrigins = ["http://localhost:3000", "https://cgrove.vercel.app"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", routes);

export default app;
