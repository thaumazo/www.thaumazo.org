DROP INDEX "users_org_created_at_active_idx";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "roles" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "blogs" ALTER COLUMN "description" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "blogs" ALTER COLUMN "content" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "created_by" integer;--> statement-breakpoint
CREATE INDEX "users_deleted_at_idx" ON "users" USING btree ("deleted_at") WHERE "users"."deleted_at" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at") WHERE "users"."deleted_at" IS NULL;--> statement-breakpoint
CREATE INDEX "users_search_idx" ON "users" USING gin (to_tsvector('english', coalesce("first_name", '') || ' ' || coalesce("last_name", '') || ' ' || coalesce("email", '')));