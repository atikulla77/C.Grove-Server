import express from "express";
import { AdminRoutes } from "./module/admin/admin.routes";

const routes = express.Router();

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
    routes: AdminRoutes
  }
]

moduleRoutes.forEach((route) => routes.use(route.path, route.routes))

export default routes;
