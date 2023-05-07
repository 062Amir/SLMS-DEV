import * as Joi from "joi";
import { UserRoles, ValidationKeys } from "../data/app.constants";

const schemas = {
  [ValidationKeys.USER as string]: Joi.object({
    name: Joi.string().required(),
    userName: Joi.string().required(),
    email: Joi.string().email().required(),
    contactNumber: Joi.string().required(),
    departmentId: Joi.string().required(),
    password: Joi.string().required().min(8),
    role: Joi.string().valid(UserRoles.HOD, UserRoles.STAFF).required(),
    profileImage: Joi.any(),
    isActive: Joi.boolean(),
  }),
  [ValidationKeys.LOGIN as string]: Joi.object({
    userName: Joi.string().required(),
    password: Joi.string().required().min(8),
  }),
  [ValidationKeys.DEPARTMENT as string]: Joi.object({
    name: Joi.string().required(),
  }),
};

const validate = (key: `${ValidationKeys}`, reqBody: any): boolean | string => {
  const { error } = schemas[key].validate(reqBody);
  return error?.details[0].message || false;
};

export default validate;
