import * as bcrypt from "bcryptjs";
import { AppDefaults } from "../data/app.constants";
import { SortOrder } from "mongoose";
import { IQuery } from "../interfaces/query.interface";

const bcryptValue = async (value: any): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(value, salt);
};

const compareBcryptValue = async (value: any, hashedValue: any): Promise<boolean> => {
  return await bcrypt.compare(value, hashedValue);
};

const encodeBase64 = (value: any) => {
  return Buffer.from(JSON.stringify(value)).toString("base64");
};

const decodeBase64 = (value: any) => {
  return JSON.parse(Buffer.from(value, "base64").toString("ascii"));
};

const getQuery = (query: any, defaultValues?: IQuery): IQuery => {
  return {
    page: parseInt(query.page as string) - 1 || defaultValues?.page || 0,
    limit: parseInt(query.limit as string) || defaultValues?.limit || 0,
    search: query.q || defaultValues?.search || "",
    sort: (query.sort || defaultValues?.sort || AppDefaults.SORT) as string,
    sortBy: (query.sortBy || query.orderBy || defaultValues?.sortBy || AppDefaults.SORT_BY) as SortOrder,
  };
};

export { bcryptValue, compareBcryptValue, encodeBase64, decodeBase64, getQuery };
