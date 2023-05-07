import { Schema, model } from "mongoose";
import { SchemaNames } from "../data/app.constants";
import { IDepartment } from "../interfaces/department.interface";

const departmentSchema = new Schema<IDepartment>({
  name: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Department = model<IDepartment>(SchemaNames.DEPARTMENT, departmentSchema);
export default Department;
