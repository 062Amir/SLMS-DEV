import { AppError } from "../classes/app-error.class";
import { AppMessages, HttpStatus, ValidationKeys } from "../data/app.constants";
import { IDepartment } from "../interfaces/department.interface";
import Department from "../models/department.model";
import validate from "../validators/validation";

const getDepartments = async (): Promise<IDepartment[]> => {
  return await Department.find();
};

const createDepartment = async (reqBody: IDepartment): Promise<IDepartment> => {
  // Validating user before saving into DB
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
  // Validating user before saving into DB
  const errorMessage = validate(ValidationKeys.DEPARTMENT, reqBody);
  if (errorMessage) {
    throw new AppError(HttpStatus.BAD_REQUEST, errorMessage);
  }

  const department = await getSingleDepartment(id);
  if (!department) {
    throw new AppError(HttpStatus.BAD_REQUEST, AppMessages.DEPARTMENT_NOT_EXIST);
  }

  await Department.findByIdAndUpdate({ _id: id }, { $set: { name: reqBody.name } });
  return { _id: id };
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
