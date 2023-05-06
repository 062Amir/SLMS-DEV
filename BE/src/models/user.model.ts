import mongoose, { Schema, model } from "mongoose";
import { IUser } from "../interfaces/user.interface";
import { SchemaNames } from "../data/app.constants";

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  userName: { type: String, required: true },
  email: { type: String, required: true },
  contactNumber: { type: String, required: true },
  departmentId: { type: mongoose.Types.ObjectId, ref: SchemaNames.DEPARTMENT, required: true },
  role: { type: String, required: true },
  password: { type: String, required: true },
  profileImage: { type: String },
  isActive: { type: Boolean },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = model<IUser>(SchemaNames.USER, userSchema);
export default User;
