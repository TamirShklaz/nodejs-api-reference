import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../errors/not-found.error";
import { InvalidBodyError } from "../errors/invalid-body.error";
import { StatusCodes } from "http-status-codes";
import { AuthError } from "../errors/auth.error";

export const errorHandler = async (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  console.log("Invalid body", err instanceof InvalidBodyError);
  if (err instanceof NotFoundError) {
    return res.status(StatusCodes.NOT_FOUND).send({ message: "Not found" });
  }
  if (err instanceof InvalidBodyError) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      status: err.status,
      message: err.message,
      details: err.details,
    });
  }

  if (err instanceof AuthError) {
    return res.status(StatusCodes.UNAUTHORIZED).send({
      message: err.message,
    });
  }

  return res.status(500).send("Something went wrong");
};
