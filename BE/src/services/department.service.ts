import { Request } from "express";
import { AppError } from "../classes/app-error.class";
import { AppMessages, HttpStatus, SortBy, ValidationKeys } from "../data/app.constants";
import { IDepartment } from "../interfaces/department.interface";
import Department from "../models/department.model";
import validate from "../validators/validation";
import { getQuery } from "./util.service";
import { IQuery } from "../interfaces/query.interface";
import { IListResponse } from "../interfaces/response.interface";

const getDepartments = async (req: Request): Promise<IListResponse> => {
  const query = getQuery(req.query, { sort: "name", sortBy: SortBy.ASC } as IQuery);
  const searchQuery = {
    $or: [{ name: { $regex: query.search, $options: "i" } }],
  };
  const departments = await Department.find(searchQuery)
    .sort([[query.sort, query.sortBy]])
    .skip(query.page * query.limit)
    .limit(query.limit);

  const total = await Department.countDocuments(searchQuery);

  return {
    data: departments,
    total,
  };
};

const createDepartment = async (reqBody: IDepartment): Promise<IDepartment> => {
  // Validating department before saving into DB
  const errorMessage = validate(ValidationKeys.DEPARTMENT, reqBody);
  if (errorMessage) {
    throw new AppError(HttpStatus.BAD_REQUEST, errorMessage);
  }

  // Checking is department already exist
  const departmentExist = await Department.findOne({ name: reqBody.name });
  if (departmentExist) {
    throw new AppError(HttpStatus.BAD_REQUEST, AppMessages.DEPARTMENT_EXIST);
  }

  // Saving data in DB
  const department = new Department({
    name: reqBody.name || "",
  });
  return await department.save();
};

const getSingleDepartment = async (id: string): Promise<IDepartment | null> => {
  return await Department.findOne({ _id: id });
};

const updateDepartment = async (id: string, reqBody: IDepartment): Promise<any> => {
  // Validating department before saving into DB
  const errorMessage = validate(ValidationKeys.DEPARTMENT, reqBody);
  if (errorMessage) {
    throw new AppError(HttpStatus.BAD_REQUEST, errorMessage);
  }

  const department = await getSingleDepartment(id);
  if (!department) {
    throw new AppError(HttpStatus.BAD_REQUEST, AppMessages.DEPARTMENT_NOT_EXIST);
  }

  return await Department.findByIdAndUpdate(id, reqBody, { new: true });
};

const deleteDepartment = async (id: string): Promise<any> => {
  const department = await getSingleDepartment(id);
  if (!department) {
    throw new AppError(HttpStatus.BAD_REQUEST, AppMessages.DEPARTMENT_NOT_EXIST);
  }

  await Department.deleteOne({ _id: id });
  return { _id: id };
};

export { getDepartments, createDepartment, getSingleDepartment, updateDepartment, deleteDepartment };
