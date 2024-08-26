import { Router } from "express";
import { tryCatch } from "../../../utils/try-catch";
import { login } from "./auth.controller";
import { validateBody } from "../../../middleware/validate-body.middleware";
import { loginSchema } from "../../../schemas/login.schema";
import { errorHandler } from "../../../middleware/error-handler.middleware";

const router = Router();

router.post("/login", validateBody(loginSchema), tryCatch(login));

router.use(errorHandler);

export default router;
