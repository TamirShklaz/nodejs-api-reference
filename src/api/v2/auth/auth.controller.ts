import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { LoginSchema } from "../../../schemas/login.schema";
import { StatusCodes } from "http-status-codes";
import { AuthError } from "../../../errors/auth.error";

export const login = async (req: Request<unknown, unknown, LoginSchema>, res: Response) => {
  const { email, password } = req.body;

  if (email === "admin" && password === "admin") {
    const token = jwt.sign({ email }, process.env.TOKEN_SECRET!, { expiresIn: "1800s" });
    return res.status(StatusCodes.OK).send({ token });
  } else {
    throw new AuthError("Invalid username or password");
  }
};
