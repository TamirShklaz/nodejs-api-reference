import { z } from "zod";

export const cursorSchema = z.object({
  id: z.number()
});