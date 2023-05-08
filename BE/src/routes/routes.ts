import { Router } from "express";
import authController from "../controllers/auth.controller";
import departmentController from "../controllers/department.controller";
import userController from "../controllers/user.controller";

const routes = Router();

routes.use("/auth", authController);
routes.use("/departments", departmentController);
routes.use("/users", userController);

export default routes;
