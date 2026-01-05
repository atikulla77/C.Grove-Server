import serverless from "serverless-http";
import app from "../src/app";

const handler = serverless(app);

export default async (req: any, res: any) => {
  res.setHeader("Access-Control-Allow-Origin", "https://cgrove.vercel.app");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  return handler(req, res);
};
