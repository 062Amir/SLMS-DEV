import { AppError } from "../classes/app-error.class";
import { AppMessages, HttpStatus, ValidationKeys } from "../data/app.constants";
import { ILoginCredentials } from "../interfaces/login-credentials.interface";
import { IUser } from "../interfaces/user.interface";
import User from "../models/user.model";
import validate from "../validators/validation";
import { compareBcryptValue, encodeBase64 } from "./util.service";
import * as jwt from "jsonwebtoken";

interface ILoginResponse {
  token: string;
  user: IUser | string;
}

const login = async (reqBody: ILoginCredentials): Promise<ILoginResponse> => {
  // Validating user before saving into DB
  const errorMessage = validate(ValidationKeys.LOGIN, reqBody);
  if (errorMessage) {
    throw new AppError(HttpStatus.BAD_REQUEST, errorMessage);
  }

  // Checking is user already exist
  let user: any = await User.findOne({
    $or: [{ email: reqBody.userName }, { userName: reqBody.userName }, { contactNumber: reqBody.userName }],
  });
  if (!user || !(await compareBcryptValue(reqBody.password, user.password))) {
    throw new AppError(HttpStatus.BAD_REQUEST, AppMessages.INVALID_CREDENTIALS);
  }

  // Checking is account active
  if (!user.isActive) {
    throw new AppError(HttpStatus.BAD_REQUEST, AppMessages.ACCOUNT_INACTIVE);
  }

  user = { ...user.toJSON(), password: "" };
  const encryptedUser = encodeBase64(encodeBase64(user));

  // Creating token
  const token = jwt.sign({ user: encryptedUser }, process.env.TOKEN_SECRET_KEY || "", { expiresIn: "1d" });
  return { token, user };
};

export { login };
