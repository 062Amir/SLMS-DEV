import { Request } from "express";
import { AppError } from "../classes/app-error.class";
import { AppMessages, HttpStatus, UserRoles, UserStatus, ValidationKeys } from "../data/app.constants";
import { IUser } from "../interfaces/user.interface";
import User from "../models/user.model";
import validate from "../validators/validation";
import { getSingleDepartment } from "./department.service";
import { bcryptValue, getQuery } from "./util.service";
import { IListResponse } from "../interfaces/response.interface";

const getUsers = async (req: Request): Promise<IListResponse> => {
  const query = getQuery(req.query);
  const searchQuery: any = {
    $and: [
      {
        $or: [
          { name: { $regex: query.search, $options: "i" } },
          { email: { $regex: query.search, $options: "i" } },
          { userName: { $regex: query.search, $options: "i" } },
          { contactNumber: { $regex: query.search, $options: "i" } },
        ],
      },
    ],
  };
  if (req.query.departmentId) {
    searchQuery.$and.push({ departmentId: { $eq: req.query.departmentId } });
  }
  if (req.query.status) {
    searchQuery.$and.push({ status: { $eq: req.query.status } });
  }
  if (req.user.role === UserRoles.ADMIN) {
    searchQuery.$and.push({ role: { $eq: UserRoles.HOD } });
  }
  if (req.user.role === UserRoles.HOD) {
    searchQuery.$and.push({ role: { $eq: UserRoles.STAFF } });
  }
  let users = await User.find(searchQuery)
    .sort([[query.sort, query.sortBy]])
    .skip(query.page * query.limit)
    .limit(query.limit);

  const total = await User.countDocuments(searchQuery);

  users = await Promise.all(
    users.map(async (user) => {
      user.password = "";
      user.department = await getSingleDepartment(user.departmentId);
      return user;
    })
  );

  return {
    data: users,
    total,
  };
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
    status: reqBody.status || UserStatus.INACTIVE,
  });
  const savedUser = await user.save();
  return { ...savedUser.toJSON(), password: "", department: await getSingleDepartment(savedUser.departmentId) };
};

const getSingleUser = async (id: string): Promise<IUser | null> => {
  const user = await User.findOne({ _id: id });
  if (user) {
    user.department = await getSingleDepartment(user.departmentId);
  }
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
  if (updatedUser) {
    updatedUser.department = await getSingleDepartment(user.departmentId);
  }
  return updatedUser;
};

export { createUser, getUsers, getSingleUser, updateUser };
