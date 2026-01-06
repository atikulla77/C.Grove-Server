import { Request, Response } from "express";
import { AdminService } from "./admin.service";
import jwt, { SignOptions } from "jsonwebtoken";
import { config } from "../../../shared/configs/env.config";

export class AdminController {
  static async login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const { accessToken, refreshToken } = await AdminService.login(
      email,
      password
    );

    // Set cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only secure in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 15 * 60 * 1000, // 15 minutes
      path: "/",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });

    // IMPORTANT: Also return tokens and user data in response
    res.status(200).json({ 
      success: true,
      message: "Admin logged in",
      accessToken, // Send token in body as well
      refreshToken,
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(401).json({ 
      success: false,
      message: error.message || "Login failed" 
    });
  }
}

  // Create REFRESH endpoint
  static async refresh(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        // if refresh token expired
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.status(401).json({ message: "Session expired" });
      }

      const decoded = jwt.verify(
        refreshToken,
        config.JWT_REFRESH_SECRET
      ) as any;

      const accessSignOptions: SignOptions = {
        expiresIn: config.JWT_REFRESH_EXPIRES as SignOptions["expiresIn"],
      };

      const newAccessToken = jwt.sign(
        { id: decoded.id, role: decoded.role },
        config.JWT_ACCESS_SECRET,
        accessSignOptions
      );

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      });

      res.status(200).json({ message: "Token refreshed" });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }

  // Logout Admin
  static async logout(req: Request, res: Response) {
    try {
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      });
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      });
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      res.status(500).json({ message: "Logout failed" });
    }
  }

  static async dashboard(req: Request, res: Response) {
    res.json({ message: "Welcome Super Admin" });
  }
}
