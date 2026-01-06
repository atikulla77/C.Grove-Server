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
    // Try multiple token sources
    let token: string | undefined;

    // 1. Check for accessToken cookie (your original)
    token = req.cookies.accessToken;

    // 2. Fallback to token cookie (common name)
    if (!token) {
      token = req.cookies.token;
    }

    // 3. Check Authorization header (Bearer token)
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    console.log("=== Auth Middleware Debug ===");
    console.log("Cookies:", req.cookies);
    console.log("Token found:", token ? "Yes" : "No");
    console.log("Authorization header:", req.headers.authorization);
    console.log("============================");

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: "Access token missing" 
      });
    }

    const decoded = jwt.verify(
      token,
      config.JWT_ACCESS_SECRET
    ) as AuthRequest["admin"];

    console.log("Decoded token:", decoded);

    req.admin = decoded;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid token" 
      });
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ 
        success: false,
        message: "Token expired" 
      });
    }

    return res.status(401).json({ 
      success: false,
      message: "Invalid or expired token" 
    });
  }
};