import * as bcrypt from "bcryptjs";

const bcryptValue = async (value: any): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(value, salt);
};

const compareBcryptValue = async (value: any, hashedValue: any): Promise<boolean> => {
  return await bcrypt.compare(value, hashedValue);
};

export { bcryptValue, compareBcryptValue };
