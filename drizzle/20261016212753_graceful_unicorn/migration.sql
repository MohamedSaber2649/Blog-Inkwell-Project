ALTER TABLE "users" ADD COLUMN "password" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL;