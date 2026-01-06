"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const prisma_1 = require("../../../shared/lib/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_config_1 = require("../../../shared/configs/env.config");
class AdminService {
    static async login(email, password) {
        const admin = await prisma_1.prisma.admin.findUnique({ where: { email } });
        if (!admin)
            throw new Error("Unauthorized");
        const valid = await bcrypt_1.default.compare(password, admin.password);
        if (!valid)
            throw new Error("Unauthorized");
        const accessSignOptions = {
            expiresIn: env_config_1.config.JWT_ACCESS_EXPIRES,
        };
        const accessToken = jsonwebtoken_1.default.sign({ id: admin.id, role: admin.role }, env_config_1.config.JWT_ACCESS_SECRET, accessSignOptions);
        const refreshSignOptions = {
            expiresIn: env_config_1.config.JWT_REFRESH_EXPIRES,
        };
        const refreshToken = jsonwebtoken_1.default.sign({ id: admin.id, role: admin.role }, env_config_1.config.JWT_REFRESH_SECRET, refreshSignOptions);
        return { accessToken, refreshToken };
    }
}
exports.AdminService = AdminService;
//# sourceMappingURL=admin.service.js.map