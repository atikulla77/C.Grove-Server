import { Request, Response } from "express";
import { AdminService } from "./admin.service";
import jwt, { SignOptions } from "jsonwebtoken";
import { config } from "../../../shared/configs/env.config";
import { AuthRequest } from "../../../shared/middlewares/auth.middleware";
import { prisma } from "../../../shared/lib/prisma";

export class AdminController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // ✅ FIXED: Get admin data from service
      const { accessToken, refreshToken, admin } = await AdminService.login(
        email,
        password
      );

      // Set cookies
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 15 * 60 * 1000, // 15 minutes
        path: "/",
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: "/",
      });

      // ✅ FIXED: Return admin data in response
      res.status(200).json({
        success: true,
        message: "Admin logged in successfully",
        accessToken,
        refreshToken,
        admin, // ← Added this
      });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(401).json({
        success: false,
        message: error.message || "Login failed",
      });
    }
  }

  // ✅ FIXED: Refresh endpoint
  static async refresh(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        return res.status(401).json({ 
          success: false,
          message: "Refresh token missing" 
        });
      }

      const decoded = jwt.verify(
        refreshToken,
        config.JWT_REFRESH_SECRET
      ) as { id: string; role: string };

      const accessSignOptions: SignOptions = {
        expiresIn: config.JWT_ACCESS_EXPIRES as SignOptions["expiresIn"],
      };

      const newAccessToken = jwt.sign(
        { id: decoded.id, role: decoded.role },
        config.JWT_ACCESS_SECRET,
        accessSignOptions
      );

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 15 * 60 * 1000,
        path: "/",
      });

      res.status(200).json({ 
        success: true,
        message: "Token refreshed",
        accessToken: newAccessToken 
      });
    } catch (error: any) {
      console.error("Refresh error:", error);
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.status(401).json({ 
        success: false,
        message: "Invalid refresh token" 
      });
    }
  }

  // ✅ FIXED: Logout
  static async logout(req: Request, res: Response) {
    try {
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
      res.status(200).json({ 
        success: true,
        message: "Logged out successfully" 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: "Logout failed" 
      });
    }
  }

  // ✅ FIXED: Get current admin
  static async getMe(req: AuthRequest, res: Response) {
    try {
      const adminId = req.admin?.id;

      if (!adminId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const admin = await prisma.admin.findUnique({
        where: { id: adminId },
        select: {
          id: true,
          email: true,
          role: true,
        },
      });

      if (!admin) {
        return res.status(404).json({
          success: false,
          message: "Admin not found",
        });
      }

      // Prevent caching
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");

      return res.status(200).json({
        success: true,
        admin,
      });
    } catch (error) {
      console.error("Get me error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}
