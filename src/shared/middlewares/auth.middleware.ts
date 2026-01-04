import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../configs/env.config";

export interface AuthRequest extends Request {
  admin?: {
    id: string;
    role: string;
  };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.accessToken;

    if (!token)
      return res.status(401).json({ message: "Access token missing" });

    const decoded = jwt.verify(
      token,
      config.JWT_ACCESS_SECRET
    ) as AuthRequest["admin"];

    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
