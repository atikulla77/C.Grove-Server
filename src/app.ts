import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./app/index.routes";

const app: Application = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://cgrove.vercel.app"
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", routes);

export default app;
