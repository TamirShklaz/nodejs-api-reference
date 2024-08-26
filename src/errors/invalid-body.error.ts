import { StatusCodes } from "http-status-codes";

export class InvalidBodyError extends Error {
  status: number;
  details: string;

  constructor(message: string, details: string) {
    super(message);
    this.name = "InvalidBodyError";
    this.status = StatusCodes.BAD_REQUEST;
    this.details = details;
  }
}
