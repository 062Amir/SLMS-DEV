import { NextFunction, Response } from "express";
import * as jwt from "jsonwebtoken";
import { AppMessages, HttpStatus } from "../data/app.constants";

const authentication = (req: any, res: Response, next: NextFunction) => {
  try {
    const token = req.headers && req.headers.token ? req.headers.token.split("Bearer ")[1] : "";
    const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET_KEY || "");
    req.user = decodedToken.user;
    next();
  } catch (error) {
    res.status(HttpStatus.UNAUTHORIZED).json({ message: AppMessages.SESSION_EXPIRED });
  }
};

export default authentication;
