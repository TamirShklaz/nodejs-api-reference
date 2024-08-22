import { boolean, integer, pgTable, serial, text } from "drizzle-orm/pg-core";

export const todos = pgTable("todos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  order: integer("order"),
  completed: boolean("completed").notNull().default(false),
});
