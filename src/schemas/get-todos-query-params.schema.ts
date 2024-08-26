import { z } from "zod";

export const getTodosQueryParamsSchema = z.object({
  cursor: z.string().optional(),
  limit: z
    .string()
    .transform((val) => parseInt(val))
    .optional()
    .default("20"),
});
// ?order_by=title&search=example&filter[completed]=true&cursor=10&limit=20&page=2

// type GetTodosQueryParams = {
//   order_by?: string;
//   search?: string;
//   completed?: string;
//   cursor?: string;
//   limit?: string;
// };

export type GetTodosQueryParams = z.infer<typeof getTodosQueryParamsSchema>;
