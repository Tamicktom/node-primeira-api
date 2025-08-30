//* Libraries imports
import { pgTable, uuid, text, date, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";

export const usersTable = pgTable(
  "users",
  {
    id: uuid().primaryKey().defaultRandom(),
    name: text().notNull(),
    email: text().notNull().unique(),
    password: text().notNull(),

    createdAt: date().notNull().defaultNow(),
    updatedAt: date().notNull().defaultNow(),
  }
);

export const coursesTable = pgTable(
  "courses",
  {
    id: uuid().primaryKey().defaultRandom(),
    title: text().notNull(),
    description: text().notNull(),

    createdAt: date().notNull().defaultNow(),
    updatedAt: date().notNull().defaultNow(),
  }
);

export const enrollmentsTable = pgTable(
  "enrollments",
  {
    userId: uuid().notNull().references(() => usersTable.id, { onDelete: "cascade" }),
    courseId: uuid().notNull().references(() => coursesTable.id, { onDelete: "cascade" }),

    createdAt: date().notNull().defaultNow(),
    updatedAt: date().notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.courseId] }),
    uniqueIndex("enrollments_unique_index").on(table.userId, table.courseId),
  ]
);