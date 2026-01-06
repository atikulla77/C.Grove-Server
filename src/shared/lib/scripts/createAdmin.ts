import "dotenv/config";
import { prisma } from "../prisma";
import bcrypt from "bcrypt";

export async function seedSuperAdmin() {
  const email = process.env.SUPER_ADMIN_EMAIL!;
  const password = process.env.SUPER_ADMIN_PASSWORD!;

  if (!email || !password) {
    throw new Error("Missing SUPER_ADMIN_EMAIL or PASSWORD");
  }

  const exists = await prisma.admin.findUnique({ where: { email } });

  if (exists) {
    console.log("⚠️ Super Admin already exists");
    return;
  }

  const hashed = await bcrypt.hash(password, 10);

  await prisma.admin.create({
    data: { email, password: hashed, role: "SUPER_ADMIN" },
  });

  console.log("✅ Super Admin created");
}

seedSuperAdmin()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

