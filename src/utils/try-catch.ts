import { NextFunction, Response, Request } from "express";

export const tryCatch = (fn: Function) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await fn(req, res);
  } catch (error) {
    next(error);
  }
};
