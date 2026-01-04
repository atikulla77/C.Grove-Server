import { prisma } from "../../../shared/lib/prisma";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { config } from "../../../shared/configs/env.config";

export class AdminService {
  static async login(email: string, password: string) {
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) throw new Error("Unauthorized");

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) throw new Error("Unauthorized");

    const accessSignOptions: SignOptions = {
      expiresIn: config.JWT_ACCESS_EXPIRES as SignOptions["expiresIn"],
    };
    const accessToken = jwt.sign(
      { id: admin.id, role: admin.role },
      config.JWT_ACCESS_SECRET,
      accessSignOptions
    );

    const refreshSignOptions: SignOptions = {
      expiresIn: config.JWT_REFRESH_EXPIRES as SignOptions["expiresIn"],
    };
    const refreshToken = jwt.sign(
      { id: admin.id, role: admin.role },
      config.JWT_REFRESH_SECRET,
      refreshSignOptions
    );

    return { accessToken, refreshToken };
  }

}
