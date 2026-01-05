import serverless from "serverless-http";
import app from "../src/app"; // your Express app

export default serverless(app);
