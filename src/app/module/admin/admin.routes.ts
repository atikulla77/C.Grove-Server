
import { Router } from "express";
import { AdminController } from "./admin.controller";
import { authMiddleware } from "../../../shared/middlewares/auth.middleware";
import { superAdminOnly } from "../../../shared/middlewares/superAdmin.middleware";

let router = Router();

// Public routes
router.post("/login", AdminController.login);
router.post("/refresh", AdminController.refresh);

// Protected routes (require auth)
router.get("/me", authMiddleware, AdminController.getMe); // ✅ FIXED
router.post("/logout", authMiddleware, AdminController.logout); // ✅ FIXED

// Super admin only routes
router.get("/dashboard", authMiddleware, superAdminOnly, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome To Dashboard",
    admin: (req as any).admin, // ✅ FIXED: should be req.admin not req.user
  });
});

export const AdminRoutes = router;
