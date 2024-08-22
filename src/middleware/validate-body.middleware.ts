import { z } from "zod";
import { NextFunction, Request, Response } from "express";
import { InvalidBodyError } from "../errors/invalid-body.error";

export const validateBody = (schema: z.ZodObject<any, any>) => (req: Request, res: Response, next: NextFunction) => {
  const { success, data, error } = schema.safeParse(req.body);
  if (error) {
    throw new InvalidBodyError("Invalid Params", error.message);
  }
  req.body = data;
  next();
};
