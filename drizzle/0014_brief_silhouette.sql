DROP INDEX "blogs_date_idx";--> statement-breakpoint
ALTER TABLE "blogs" ADD COLUMN "created_by" integer;--> statement-breakpoint
CREATE INDEX "blogs_published_at_idx" ON "blogs" USING btree ("date") WHERE "blogs"."deleted_at" IS NULL;