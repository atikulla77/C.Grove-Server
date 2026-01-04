import express from "express";
import { AdminRoutes } from "./module/admin/admin.routes";

const routes = express.Router();

routes.get("/health", (req, res) => {
  res.send("Server is Woring");
});

const moduleRoutes = [
  {
    path: "/admin",
    routes: AdminRoutes
  }
]

moduleRoutes.forEach((route) => routes.use(route.path, route.routes))

export default routes;
