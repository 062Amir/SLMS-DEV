import * as bcrypt from "bcryptjs";

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

export { bcryptValue, compareBcryptValue, encodeBase64, decodeBase64 };
