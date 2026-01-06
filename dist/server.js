"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const prisma_js_1 = require("./shared/lib/prisma.js");
const env_config_js_1 = require("./shared/configs/env.config.js");
const app_js_1 = __importDefault(require("./app.js"));
let server;
const main = async () => {
    server = new http_1.Server(app_js_1.default);
    server.listen(env_config_js_1.config.port, () => {
        console.log(`c.grove Server Runing: ${env_config_js_1.config.port}`);
    });
};
main()
    .catch((err) => {
    console.log(`Error During Server Status: `, err);
})
    .finally(async () => {
    await prisma_js_1.prisma.$disconnect();
});
//# sourceMappingURL=server.js.map