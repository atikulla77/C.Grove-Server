// import serverless from "serverless-http";
// import app from "../src/app"; // your Express app

// export const handler = serverless(app);

export default function handler(req: any, res: any) {
  res.status(200).json({ message: "Serverless function works!" });
}