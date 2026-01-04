import { NextFunction, Response } from "express";
import { AuthRequest } from "./auth.middleware";

export const superAdminOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.admin) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.admin.role !== "SUPER_ADMIN") {
    return res.status(403).json({ message: "Forbidden: Super admin only" });
  }
  next()
};
