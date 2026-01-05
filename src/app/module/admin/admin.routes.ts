import { Router } from "express";
import { AdminController } from "./admin.controller";
import { authMiddleware } from "../../../shared/middlewares/auth.middleware";
import { superAdminOnly } from "../../../shared/middlewares/superAdmin.middleware";

let router = Router();

// Public
router.post("/login", AdminController.login);
router.post("/refresh", AdminController.refresh);
router.post("/logout", AdminController.logout);

router.get("/me", authMiddleware, (req, res) => {
  res.status(200).json({
    authenticated: true,
    admin: (req as any).user,
  });
});

// Protected
router.use(authMiddleware, superAdminOnly);
router.get("/dashboard", (req, res) => {
  res.status(200).json({
    message: "Welcome To Dashboard",
    user: (req as any).user,
  });
});

export const AdminRoutes = router;
