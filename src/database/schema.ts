//* Libraries imports
import {
  pgTable,
  uuid,
  text,
  integer,
  date,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  email: text().notNull().unique(),

  createdAt: date().notNull().defaultNow(),
  updatedAt: date().notNull().defaultNow(),
});

export const coursesTable = pgTable("courses", {
  id: uuid().primaryKey().defaultRandom(),
  title: text().notNull(),
  description: text().notNull(),

  createdAt: date().notNull().defaultNow(),
  updatedAt: date().notNull().defaultNow(),
});