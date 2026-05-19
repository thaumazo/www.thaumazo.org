ALTER TABLE "blogs" ALTER COLUMN "published_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "blogs" ALTER COLUMN "published_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "blogs" ALTER COLUMN "draft" SET DEFAULT true;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "visibility" text DEFAULT 'draft' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "og_image" integer;--> statement-breakpoint
ALTER TABLE "blogs" ADD COLUMN "visibility" text DEFAULT 'draft' NOT NULL;--> statement-breakpoint
ALTER TABLE "blogs" ADD COLUMN "og_image" integer;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "visibility" text DEFAULT 'draft' NOT NULL;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "og_image" integer;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "visibility" text DEFAULT 'draft' NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "og_image" integer;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "visibility" text DEFAULT 'draft' NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "og_image" integer;--> statement-breakpoint
UPDATE "users" SET "visibility" = CASE WHEN "draft" = true THEN 'unlisted' ELSE 'published' END;--> statement-breakpoint
UPDATE "blogs" SET "visibility" = CASE WHEN "draft" = true THEN 'unlisted' ELSE 'published' END;--> statement-breakpoint
UPDATE "organizations" SET "visibility" = CASE WHEN "draft" = true THEN 'unlisted' ELSE 'published' END;--> statement-breakpoint
UPDATE "projects" SET "visibility" = CASE WHEN "draft" = true THEN 'unlisted' ELSE 'published' END;--> statement-breakpoint
UPDATE "services" SET "visibility" = CASE WHEN "draft" = true THEN 'unlisted' ELSE 'published' END;
