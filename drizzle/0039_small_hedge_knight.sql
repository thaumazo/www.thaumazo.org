ALTER TABLE "content" DROP CONSTRAINT IF EXISTS "content_public_id_unique";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_public_id_unique";--> statement-breakpoint
ALTER TABLE "blog" DROP CONSTRAINT IF EXISTS "blog_public_id_unique";--> statement-breakpoint
ALTER TABLE "organizations" DROP CONSTRAINT IF EXISTS "organizations_public_id_unique";--> statement-breakpoint
ALTER TABLE "user_organizations" DROP CONSTRAINT IF EXISTS "user_organizations_public_id_unique";--> statement-breakpoint
ALTER TABLE "project_organizations" DROP CONSTRAINT IF EXISTS "project_organizations_public_id_unique";--> statement-breakpoint
ALTER TABLE "projects" DROP CONSTRAINT IF EXISTS "projects_public_id_unique";--> statement-breakpoint
ALTER TABLE "user_projects" DROP CONSTRAINT IF EXISTS "user_projects_public_id_unique";--> statement-breakpoint
ALTER TABLE "services" DROP CONSTRAINT IF EXISTS "services_public_id_unique";--> statement-breakpoint
ALTER TABLE "user_services" DROP CONSTRAINT IF EXISTS "user_services_public_id_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "users_org_deleted_at_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "users_published_at_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "blog_published_at_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "blog_tags_blog_id_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "organization_tags_organization_id_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "organizations_published_at_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "project_tags_project_id_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "projects_published_at_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "service_tags_service_id_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "services_published_at_idx";--> statement-breakpoint
LOCK TABLE "content" IN ACCESS EXCLUSIVE MODE;--> statement-breakpoint
ALTER TABLE "content" ALTER COLUMN "seo_title" SET DEFAULT '';--> statement-breakpoint
UPDATE "content" SET "seo_title" = '' WHERE "seo_title" IS NULL;--> statement-breakpoint
ALTER TABLE "content" ALTER COLUMN "seo_title" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "content" ALTER COLUMN "seo_description" SET DEFAULT '';--> statement-breakpoint
UPDATE "content" SET "seo_description" = '' WHERE "seo_description" IS NULL;--> statement-breakpoint
ALTER TABLE "content" ALTER COLUMN "seo_description" SET NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_visibility_published_at_idx" ON "users" USING btree ("visibility","published_at") WHERE "users"."deleted_at" IS NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "blog_visibility_published_at_idx" ON "blog" USING btree ("visibility","published_at") WHERE "blog"."deleted_at" IS NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "organizations_visibility_published_at_idx" ON "organizations" USING btree ("visibility","published_at") WHERE "organizations"."deleted_at" IS NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "projects_visibility_published_at_idx" ON "projects" USING btree ("visibility","published_at") WHERE "projects"."deleted_at" IS NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "services_visibility_published_at_idx" ON "services" USING btree ("visibility","published_at") WHERE "services"."deleted_at" IS NULL;--> statement-breakpoint
ALTER TABLE "content" DROP COLUMN IF EXISTS "public_id";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "public_id";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "draft";--> statement-breakpoint
ALTER TABLE "blog" DROP COLUMN IF EXISTS "public_id";--> statement-breakpoint
ALTER TABLE "blog" DROP COLUMN IF EXISTS "draft";--> statement-breakpoint
ALTER TABLE "organizations" DROP COLUMN IF EXISTS "public_id";--> statement-breakpoint
ALTER TABLE "organizations" DROP COLUMN IF EXISTS "draft";--> statement-breakpoint
ALTER TABLE "user_organizations" DROP COLUMN IF EXISTS "public_id";--> statement-breakpoint
ALTER TABLE "project_organizations" DROP COLUMN IF EXISTS "public_id";--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN IF EXISTS "public_id";--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN IF EXISTS "draft";--> statement-breakpoint
ALTER TABLE "user_projects" DROP COLUMN IF EXISTS "public_id";--> statement-breakpoint
ALTER TABLE "services" DROP COLUMN IF EXISTS "public_id";--> statement-breakpoint
ALTER TABLE "services" DROP COLUMN IF EXISTS "draft";--> statement-breakpoint
ALTER TABLE "user_services" DROP COLUMN IF EXISTS "public_id";
