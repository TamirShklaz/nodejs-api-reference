import { z } from "zod";

export const createTodoSchema = z.object({
  title: z.string(),
  order: z.number().int().optional(),
  completed: z.boolean().optional().default(false)
});


export type CreateTodoSchema = z.infer<typeof createTodoSchema>