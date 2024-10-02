import { z } from "zod";
import { validPriorities, validStatuses } from "@/db/schema";

export const todoSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  status: z.enum(validStatuses).optional(),
  priority: z.enum(validPriorities).optional(),
  todoListId: z.string().optional(),
});

export const getTodosQueryParamsSchema = z.object({
  cursor: z.string().optional(),
  order_by: z.enum(["priority"]).optional(),
  order: z.enum(["asc", "desc"]).optional().default("asc"),
  status: z.enum(validStatuses).optional(),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 20))
    .default("20"),
});

export type CreateTodoSchema = z.infer<typeof todoSchema>;
export type GetTodoQueryParams = z.infer<typeof getTodosQueryParamsSchema>;
