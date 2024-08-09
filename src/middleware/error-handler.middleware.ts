import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../errors/not-found.error";

export const errorHandler = async (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  if (err instanceof NotFoundError) {
    return res.status(404).send(err.message);
  }

  return res.status(500).send("Something went wrong");
};
