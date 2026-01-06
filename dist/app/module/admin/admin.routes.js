"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoutes = void 0;
const express_1 = require("express");
const admin_controller_1 = require("./admin.controller");
const auth_middleware_1 = require("../../../shared/middlewares/auth.middleware");
const superAdmin_middleware_1 = require("../../../shared/middlewares/superAdmin.middleware");
let router = (0, express_1.Router)();
// Public
router.post("/login", admin_controller_1.AdminController.login);
router.post("/refresh", admin_controller_1.AdminController.refresh);
router.post("/logout", admin_controller_1.AdminController.logout);
router.get("/me", auth_middleware_1.authMiddleware, (req, res) => {
    res.status(200).json({
        authenticated: true,
        admin: req.user,
    });
});
// Protected
router.use(auth_middleware_1.authMiddleware, superAdmin_middleware_1.superAdminOnly);
router.get("/dashboard", (req, res) => {
    res.status(200).json({
        message: "Welcome To Dashboard",
        user: req.user,
    });
});
exports.AdminRoutes = router;
//# sourceMappingURL=admin.routes.js.map