import { Request, Response, Router } from "express";
import { HttpStatus } from "../data/app.constants";
import { createUser } from "../services/user.service";
import { login } from "../services/auth.service";

const authController = Router();

authController.post("/register", async (req: Request, res: Response) => {
  try {
    const user = await createUser({ ...req.body, isActive: false });
    res.status(HttpStatus.OK).json(user);
  } catch (error: any) {
    res.status(error?.code || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error?.message, error });
  }
});

authController.post("/login", async (req: Request, res: Response) => {
  try {
    const response = await login(req.body);
    res.status(HttpStatus.OK).json(response);
  } catch (error: any) {
    res.status(error?.code || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error?.message, error });
  }
});

export default authController;
