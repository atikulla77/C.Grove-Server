import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { AdminRoutes } from "./app/module/admin/admin.routes";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://cgrove.vercel.app"
  ],
  credentials: true,
}));

app.use("/api/v1/admin", AdminRoutes);

export default app;
