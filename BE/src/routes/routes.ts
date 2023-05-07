import { Router } from "express";
import authController from "../controllers/auth.controller";
import departmentController from "../controllers/department.controller";

const routes = Router();

routes.use("/auth", authController);
routes.use("/departments", departmentController);

export default routes;
