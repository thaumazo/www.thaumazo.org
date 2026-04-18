ALTER TABLE "blogs" RENAME COLUMN "date" TO "published_at";--> statement-breakpoint
DROP INDEX "blogs_published_at_idx";--> statement-breakpoint
CREATE INDEX "blogs_published_at_idx" ON "blogs" USING btree ("published_at") WHERE "blogs"."deleted_at" IS NULL;