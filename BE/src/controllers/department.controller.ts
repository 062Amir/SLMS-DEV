import { Request, Response, Router } from "express";
import { AppMessages, HttpStatus } from "../data/app.constants";
import { createDepartment, deleteDepartment, getDepartments, getSingleDepartment, updateDepartment } from "../services/department.service";
import authentication from "../middleware/authentication.middleware";
import { AppError } from "../classes/app-error.class";

const departmentController = Router();

departmentController.get("/", async (req: Request, res: Response) => {
  try {
    const departments = await getDepartments();
    res.status(HttpStatus.OK).json(departments);
  } catch (error: any) {
    res.status(error?.code || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error?.message, error });
  }
});

departmentController.get("/:id", authentication, async (req: Request, res: Response) => {
  try {
    const department = await getSingleDepartment(req.params.id);
    if (!department) {
      throw new AppError(HttpStatus.NOT_FOUND, AppMessages.DEPARTMENT_NOT_EXIST);
    }
    res.status(HttpStatus.OK).json(department);
  } catch (error: any) {
    res.status(error?.code || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error?.message, error });
  }
});

departmentController.post("/", authentication, async (req: Request, res: Response) => {
  try {
    const department = await createDepartment(req.body);
    res.status(HttpStatus.CREATED).json(department);
  } catch (error: any) {
    res.status(error?.code || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error?.message, error });
  }
});

departmentController.put("/:id", authentication, async (req: Request, res: Response) => {
  try {
    const response = await updateDepartment(req.params.id, req.body);
    res.status(HttpStatus.OK).json(response);
  } catch (error: any) {
    res.status(error?.code || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error?.message, error });
  }
});

departmentController.delete("/:id", authentication, async (req: Request, res: Response) => {
  try {
    const response = await deleteDepartment(req.params.id);
    res.status(HttpStatus.OK).json(response);
  } catch (error: any) {
    res.status(error?.code || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error?.message, error });
  }
});

export default departmentController;
