ALTER TABLE "login_failures" ALTER COLUMN "ip" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "login_failures" ADD COLUMN "geo" jsonb;