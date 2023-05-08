import * as Joi from "joi";
import { UserRoles, ValidationKeys } from "../data/app.constants";

const schemas = {
  [ValidationKeys.NEW_USER]: Joi.object({
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
  [ValidationKeys.UPDATE_USER]: Joi.object({
    name: Joi.string().required(),
    userName: Joi.string().required(),
    email: Joi.string().email().required(),
    contactNumber: Joi.string().required(),
    profileImage: Joi.any(),
  }),
  [ValidationKeys.ACTIVATE_USER]: Joi.object({
    isActive: Joi.boolean().valid(true, false).required(),
  }),
  [ValidationKeys.LOGIN]: Joi.object({
    userName: Joi.string().required(),
    password: Joi.string().required().min(8),
  }),
  [ValidationKeys.DEPARTMENT]: Joi.object({
    name: Joi.string().required(),
  }),
};

const validate = (key: `${ValidationKeys}`, reqBody: any): boolean | string => {
  const { error } = schemas[key].validate(reqBody);
  return error?.details[0].message || false;
};

export default validate;
