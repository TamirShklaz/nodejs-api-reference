import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../errors/not-found.error";
import { InvalidBodyError } from "../errors/invalid-body.error";
import { StatusCodes } from "http-status-codes";

export const errorHandler = async (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  console.log("Invalid body", err instanceof InvalidBodyError);
  if (err instanceof NotFoundError) {
    return res.status(404).send(err.message);
  }
  if (err instanceof InvalidBodyError) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      status: err.status,
      message: err.message,
      details: err.details
    });
  }

  return res.status(500).send("Something went wrong");
};
