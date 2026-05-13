ALTER TABLE "audit_logs" ADD COLUMN "pathname" text;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD COLUMN "geo" jsonb;