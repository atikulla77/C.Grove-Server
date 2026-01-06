"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const admin_service_1 = require("./admin.service");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_config_1 = require("../../../shared/configs/env.config");
class AdminController {
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const { accessToken, refreshToken } = await admin_service_1.AdminService.login(email, password);
            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 15 * 60 * 1000,
                path: "/",
            });
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: "/",
            });
            res.status(200).json({ message: "Admin logged in" });
        }
        catch (error) {
            res.status(401).json({ message: error.message });
        }
    }
    // Create REFRESH endpoint
    static async refresh(req, res) {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                // if refresh token expired
                res.clearCookie("accessToken");
                res.clearCookie("refreshToken");
                res.status(401).json({ message: "Session expired" });
            }
            const decoded = jsonwebtoken_1.default.verify(refreshToken, env_config_1.config.JWT_REFRESH_SECRET);
            const accessSignOptions = {
                expiresIn: env_config_1.config.JWT_REFRESH_EXPIRES,
            };
            const newAccessToken = jsonwebtoken_1.default.sign({ id: decoded.id, role: decoded.role }, env_config_1.config.JWT_ACCESS_SECRET, accessSignOptions);
            res.cookie("accessToken", newAccessToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                path: "/",
            });
            res.status(200).json({ message: "Token refreshed" });
        }
        catch (error) {
            res.status(401).json({ message: error.message });
        }
    }
    // Logout Admin
    static async logout(req, res) {
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
        }
        catch (error) {
            res.status(500).json({ message: "Logout failed" });
        }
    }
    static async dashboard(req, res) {
        res.json({ message: "Welcome Super Admin" });
    }
}
exports.AdminController = AdminController;
//# sourceMappingURL=admin.controller.js.map