import { AppError } from "../classes/app-error.class";
import { AppMessages, HttpStatus, ValidationKeys } from "../data/app.constants";
import { IUser } from "../interfaces/user.interface";
import User from "../models/user.model";
import validate from "../validators/validation";
import { bcryptValue } from "./util.service";

const getUsers = async (): Promise<IUser[]> => {
  const users = await User.find();
  return users.map((user) => {
    user.password = "";
    return user;
  });
};

const createUser = async (reqBody: IUser): Promise<IUser> => {
  // Validating user before saving into DB
  const errorMessage = validate(ValidationKeys.NEW_USER, reqBody);
  if (errorMessage) {
    throw new AppError(HttpStatus.BAD_REQUEST, errorMessage);
  }

  // Checking is user already exist
  const existUser = await User.findOne({
    $or: [{ email: reqBody.email }, { userName: reqBody.userName }, { contactNumber: reqBody.contactNumber }],
  });
  if (existUser) {
    throw new AppError(HttpStatus.BAD_REQUEST, AppMessages.USER_ALREADY_EXISTS);
  }

  // Hashing Password before saving into DB
  const hashedPassword = await bcryptValue(reqBody.password);

  // Saving data in DB
  const user = new User({
    name: reqBody.name || "",
    userName: reqBody.userName || "",
    email: reqBody.email || "",
    contactNumber: reqBody.contactNumber || "",
    departmentId: reqBody.departmentId || "",
    password: hashedPassword || "",
    role: reqBody.role || "",
    profileImage: reqBody.profileImage || null,
    isActive: reqBody.isActive || false,
  });
  const savedUser = await user.save();
  return { ...savedUser.toJSON(), password: "" };
};

const getSingleUser = async (id: string): Promise<IUser | null> => {
  const user = await User.findOne({ _id: id });
  user ? (user.password = "") : null;
  return user;
};

const updateUser = async (id: string, reqBody: IUser, updateStatus?: boolean): Promise<any> => {
  // Validating user before saving into DB
  const errorMessage = validate(updateStatus ? ValidationKeys.ACTIVATE_USER : ValidationKeys.UPDATE_USER, reqBody);
  if (errorMessage) {
    throw new AppError(HttpStatus.BAD_REQUEST, errorMessage);
  }

  const user = await getSingleUser(id);
  if (!user) {
    throw new AppError(HttpStatus.NOT_FOUND, AppMessages.USER_NOT_EXIST);
  }

  // TODO: Need to check updated object values
  const updatedUser = await User.findByIdAndUpdate(id, reqBody);
  updatedUser ? (updatedUser.password = "") : null;
  return user;
};

export { createUser, getUsers, getSingleUser, updateUser };
