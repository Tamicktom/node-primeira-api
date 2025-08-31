CREATE TYPE "public"."user_roles" AS ENUM('admin', 'student');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" "user_roles" DEFAULT 'student' NOT NULL;