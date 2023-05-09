import { Request, Response, Router } from "express";
import { AppMessages, HttpStatus, UserRoles } from "../data/app.constants";
import auth from "../middleware/auth.middleware";
import { AppError } from "../classes/app-error.class";
import { createUser, getSingleUser, getUsers, updateUser } from "../services/user.service";
import { IUser } from "../interfaces/user.interface";
import imageValidator from "../validators/image.validator";
import { uploadFileOnFirebase } from "../services/upload.service";
import { sendAccountActivationMail, sendAccountCreatedMail } from "../services/mail.service";

const userController = Router();

userController.get("/", auth([UserRoles.ADMIN]), async (req: Request, res: Response) => {
  try {
    const users = await getUsers();
    res.status(HttpStatus.OK).json(users);
  } catch (error: any) {
    res.status(error?.code || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error?.message, error });
  }
});

userController.get("/:id", auth([UserRoles.ADMIN]), async (req: Request, res: Response) => {
  try {
    const user = await getSingleUser(req.params.id);
    if (!user) {
      throw new AppError(HttpStatus.NOT_FOUND, AppMessages.USER_NOT_EXIST);
    }
    res.status(HttpStatus.OK).json(user);
  } catch (error: any) {
    res.status(error?.code || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error?.message, error });
  }
});

userController.post("/", auth([UserRoles.ADMIN]), imageValidator, async (req: Request, res: Response) => {
  try {
    // TODO: File error to be handle
    let uploadedFileUrl = null;
    if (req.file) {
      uploadedFileUrl = await uploadFileOnFirebase(req.file as Express.Multer.File);
      if (!uploadedFileUrl) {
        throw new AppError(HttpStatus.BAD_REQUEST, AppMessages.INVALID_IMAGE);
      }
    }
    const user = await createUser({ ...req.body, isActive: true, profileImage: uploadedFileUrl });
    await sendAccountCreatedMail({ ...user, password: req.body.password });
    res.status(HttpStatus.CREATED).json(user);
  } catch (error: any) {
    res.status(error?.code || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error?.message, error });
  }
});

userController.put("/:id", auth(), imageValidator, async (req: Request, res: Response) => {
  try {
    if (req.user.role !== UserRoles.ADMIN && req.user._id !== req.params.id) {
      throw new AppError(HttpStatus.FORBIDDEN, AppMessages.UNAUTHORIZED);
    }
    // TODO: File error to be handle
    if (req.file) {
      const uploadedFileUrl = await uploadFileOnFirebase(req.file as Express.Multer.File);
      if (!uploadedFileUrl) {
        throw new AppError(HttpStatus.BAD_REQUEST, AppMessages.INVALID_IMAGE);
      }
      req.body.profileImage = uploadedFileUrl;
    }
    const response = await updateUser(req.params.id, req.body);
    res.status(HttpStatus.OK).json(response);
  } catch (error: any) {
    res.status(error?.code || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error?.message, error });
  }
});

userController.post("/:id/activate", auth([UserRoles.ADMIN, UserRoles.HOD]), async (req: Request, res: Response) => {
  try {
    const response = await updateUser(req.params.id, { isActive: true } as IUser, true);
    await sendAccountActivationMail(response);
    res.status(HttpStatus.OK).json(response);
  } catch (error: any) {
    res.status(error?.code || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error?.message, error });
  }
});

userController.post("/:id/deactivate", auth([UserRoles.ADMIN, UserRoles.HOD]), async (req: Request, res: Response) => {
  try {
    const response = await updateUser(req.params.id, { isActive: false } as IUser, true);
    res.status(HttpStatus.OK).json(response);
  } catch (error: any) {
    res.status(error?.code || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error?.message, error });
  }
});

export default userController;
