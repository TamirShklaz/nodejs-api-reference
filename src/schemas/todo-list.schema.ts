import { z } from "zod";

export const createTodoListSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
});

export const shareTodoListSchema = z.object({
  userIds: z.array(z.string()).nonempty(),
});

export type CreateTodoListInput = z.infer<typeof createTodoListSchema>;
export type ShareTodoListInput = z.infer<typeof shareTodoListSchema>;
