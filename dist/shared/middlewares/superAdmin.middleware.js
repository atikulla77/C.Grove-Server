"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.superAdminOnly = void 0;
const superAdminOnly = (req, res, next) => {
    if (!req.admin) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    if (req.admin.role !== "SUPER_ADMIN") {
        return res.status(403).json({ message: "Forbidden: Super admin only" });
    }
    next();
};
exports.superAdminOnly = superAdminOnly;
//# sourceMappingURL=superAdmin.middleware.js.map