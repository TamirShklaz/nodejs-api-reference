import { pgEnum, pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const validStatuses = ["pending", "in_progress", "completed"] as const;
export const validPriorities = ["low", "medium", "high"] as const;
export const validPermissions = ["view", "edit"] as const;

export const status = pgEnum("status", validStatuses);
export const priority = pgEnum("priority", validPriorities);
export const permissions = pgEnum("permissions", validPermissions);

export const todos = pgTable("todos", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  status: status("status").notNull().default("pending"),
  priority: priority("priority").notNull().default("medium"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  //TODO: Setup a db trigger to update this field on every update
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  todoListId: uuid("todo_list_id").references(() => todoList.id, {
    onDelete: "cascade",
  }),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  deletedAt: timestamp("deleted_at"),
});

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  //TODO: Hash the password before storing it
  password: text("password").notNull(),
  //TODO: setup auth without password
  createdAt: timestamp("created_at").notNull().defaultNow(),
  //TODO: Setup a db trigger to update this field on every update
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// - A user should be able to create a todo list
// - Add a task, delete a task from a todolist
// Muiltiple todo lists
// Share a todolist
// View only
// Edit a todolist
// Edit a task in the todolist

export const todoList = pgTable("todo_list", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  //TODO: Setup a db trigger to update this field on every update
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const todoListPermission = pgTable(
  "todo_list_permission",
  {
    todoListId: uuid("todo_list_id").references(() => todoList.id, {
      onDelete: "cascade",
    }),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    permission: permissions("permission").notNull().default("view"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    //TODO: Setup a db trigger to update this field on every update
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({ pk: primaryKey({ columns: [t.userId, t.todoListId] }) }),
);

export const todoListRelations = relations(todoList, ({ many, one }) => ({
  tasks: many(todos),
  createdBy: one(users, {
    fields: [todoList.userId],
    references: [users.id],
  }),
  sharedWith: many(todoListPermission),
}));

export const userRelations = relations(users, ({ many, one }) => ({
  todoLists: many(todoList),
  sharedTodoLists: many(todoListPermission),
  tasks: many(todos),
}));

export const todoRelations = relations(todos, ({ one }) => ({
  todoList: one(todoList, {
    fields: [todos.todoListId],
    references: [todoList.id],
  }),
  createdBy: one(users, {
    fields: [todos.userId],
    references: [users.id],
  }),
}));

export const todoListPermissionRelations = relations(todoListPermission, ({ one }) => ({
  todoList: one(todoList, {
    fields: [todoListPermission.todoListId],
    references: [todoList.id],
  }),
  user: one(users, {
    fields: [todoListPermission.userId],
    references: [users.id],
  }),
}));

// Indexes
// Get all my tasks
// Persmisions -> lists -> todos
// Priority

// Integrity
// Two users edit a task at the same time.

// Edge cases
// What happens when a user is deleted with a shared list? - Transfer ownership to a user on the permisions table with edit permissions

// Deletion
//
