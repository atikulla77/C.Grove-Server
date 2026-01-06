"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const index_routes_js_1 = __importDefault(require("./app/index.routes.js"));
const app = (0, express_1.default)();
// CORS configuration
const allowedOrigins = [
    "http://localhost:3000",
    "https://cgrove.vercel.app",
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin)
            return callback(null, true);
        // In development, allow all origins
        if (process.env.NODE_ENV === "development") {
            return callback(null, true);
        }
        // In production, check against whitelist
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));
// Handle preflight requests for all routes
// ✅ FIXED: Use proper syntax instead of "*"
// app.options("/:path(*)", cors());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/api/v1", index_routes_js_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map