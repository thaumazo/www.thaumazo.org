DROP INDEX IF EXISTS "users_email_unique_active";--> statement-breakpoint
ALTER TABLE "content" ADD COLUMN IF NOT EXISTS "public_id" text;--> statement-breakpoint
UPDATE "content" SET "public_id" = 'content-' || "id"::text WHERE "public_id" IS NULL;--> statement-breakpoint
ALTER TABLE "content" ALTER COLUMN "public_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "content" ADD COLUMN IF NOT EXISTS "created_by" integer;--> statement-breakpoint
ALTER TABLE "content" ADD COLUMN IF NOT EXISTS "deleted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "middle_name" text DEFAULT '' NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "content_deleted_at_idx" ON "content" USING btree ("deleted_at") WHERE "content"."deleted_at" IS NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "content_created_at_idx" ON "content" USING btree ("created_at") WHERE "content"."deleted_at" IS NULL;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_unique_active" ON "users" USING btree (lower("email")) WHERE "users"."deleted_at" IS NULL AND "users"."email" <> '';--> statement-breakpoint
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'content_public_id_unique'
  ) THEN
    ALTER TABLE "content" ADD CONSTRAINT "content_public_id_unique" UNIQUE("public_id");
  END IF;
END $$;
