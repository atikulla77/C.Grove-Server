import { Server } from "http";
import { prisma } from "./shared/lib/prisma.js";
import { config } from "./shared/configs/env.config.js";
import app from "./app.js";

let server: Server;

const main = async () => {
  server = new Server(app);
  server.listen(config.port, () => {
    console.log(`c.grove Server Runing: ${config.port}`);
  });
};

main()
  .catch((err: any) => {
    console.log(`Error During Server Status: `, err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
