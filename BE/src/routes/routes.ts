import { Router } from "express";
import authController from "../controllers/auth.controller";

const routes = Router();

routes.use("/auth", authController);

export default routes;
