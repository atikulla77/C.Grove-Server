"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_routes_1 = require("./module/admin/admin.routes");
const routes = express_1.default.Router();
routes.get("/", (req, res) => {
    res.send("C.Grove Server is Woring");
});
routes.get("/__cors_test", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    return res.json({
        ok: true,
        origin: req.headers.origin || null,
    });
});
const moduleRoutes = [
    {
        path: "/admin",
        routes: admin_routes_1.AdminRoutes
    }
];
moduleRoutes.forEach((route) => routes.use(route.path, route.routes));
exports.default = routes;
//# sourceMappingURL=index.routes.js.map