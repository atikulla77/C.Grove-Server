import { Server } from "http";
import { prisma } from "./shared/lib/prisma";
import { config } from "./shared/configs/env.config";
import app from "./app";
import { seedSuperAdmin } from "./shared/lib/scripts/createAdmin";

let server: Server;

const main = async () => {
  await seedSuperAdmin();
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
