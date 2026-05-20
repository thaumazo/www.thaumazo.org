ALTER TABLE "blog_images" DROP CONSTRAINT IF EXISTS "blog_images_blog_id_blogs_id_fk";--> statement-breakpoint
ALTER TABLE "blog_tags" DROP CONSTRAINT IF EXISTS "blog_tags_blog_id_blogs_id_fk";--> statement-breakpoint
DO $$
BEGIN
  IF to_regclass('public.blogs') IS NOT NULL AND to_regclass('public.blog') IS NULL THEN
    ALTER TABLE "blogs" RENAME TO "blog";
  END IF;
END $$;--> statement-breakpoint
DO $$
BEGIN
  IF to_regclass('public.blogs_id_seq') IS NOT NULL AND to_regclass('public.blog_id_seq') IS NULL THEN
    ALTER SEQUENCE "blogs_id_seq" RENAME TO "blog_id_seq";
  END IF;
END $$;--> statement-breakpoint
ALTER TABLE "blog" ADD COLUMN IF NOT EXISTS "public_id" text;--> statement-breakpoint
UPDATE "blog" SET "public_id" = 'blog-' || "id"::text WHERE "public_id" IS NULL;--> statement-breakpoint
ALTER TABLE "blog" ALTER COLUMN "public_id" SET NOT NULL;--> statement-breakpoint
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'blogs_public_id_unique'
      AND conrelid = 'public.blog'::regclass
  ) THEN
    ALTER TABLE "blog" RENAME CONSTRAINT "blogs_public_id_unique" TO "blog_public_id_unique";
  ELSIF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'blog_public_id_unique'
      AND conrelid = 'public.blog'::regclass
  ) THEN
    ALTER TABLE "blog" ADD CONSTRAINT "blog_public_id_unique" UNIQUE("public_id");
  END IF;
END $$;--> statement-breakpoint
DO $$
BEGIN
  IF to_regclass('public.blogs_deleted_at_idx') IS NOT NULL AND to_regclass('public.blog_deleted_at_idx') IS NULL THEN
    ALTER INDEX "blogs_deleted_at_idx" RENAME TO "blog_deleted_at_idx";
  END IF;
END $$;--> statement-breakpoint
DO $$
BEGIN
  IF to_regclass('public.blogs_created_at_idx') IS NOT NULL AND to_regclass('public.blog_created_at_idx') IS NULL THEN
    ALTER INDEX "blogs_created_at_idx" RENAME TO "blog_created_at_idx";
  END IF;
END $$;--> statement-breakpoint
DO $$
BEGIN
  IF to_regclass('public.blogs_published_at_idx') IS NOT NULL AND to_regclass('public.blog_published_at_idx') IS NULL THEN
    ALTER INDEX "blogs_published_at_idx" RENAME TO "blog_published_at_idx";
  END IF;
END $$;--> statement-breakpoint
DO $$
BEGIN
  IF to_regclass('public.blogs_slug_unique') IS NOT NULL AND to_regclass('public.blog_slug_unique') IS NULL THEN
    ALTER INDEX "blogs_slug_unique" RENAME TO "blog_slug_unique";
  END IF;
END $$;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "blog_deleted_at_idx" ON "blog" USING btree ("deleted_at") WHERE "blog"."deleted_at" IS NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "blog_created_at_idx" ON "blog" USING btree ("created_at") WHERE "blog"."deleted_at" IS NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "blog_published_at_idx" ON "blog" USING btree ("published_at") WHERE "blog"."deleted_at" IS NULL;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "blog_slug_unique" ON "blog" USING btree ("slug") WHERE "blog"."deleted_at" IS NULL;--> statement-breakpoint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'blog_images_blog_id_blog_id_fk'
      AND conrelid = 'public.blog_images'::regclass
  ) THEN
    ALTER TABLE "blog_images" ADD CONSTRAINT "blog_images_blog_id_blog_id_fk" FOREIGN KEY ("blog_id") REFERENCES "public"."blog"("id") ON DELETE cascade ON UPDATE no action;
  END IF;
END $$;--> statement-breakpoint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'blog_tags_blog_id_blog_id_fk'
      AND conrelid = 'public.blog_tags'::regclass
  ) THEN
    ALTER TABLE "blog_tags" ADD CONSTRAINT "blog_tags_blog_id_blog_id_fk" FOREIGN KEY ("blog_id") REFERENCES "public"."blog"("id") ON DELETE cascade ON UPDATE no action;
  END IF;
END $$;
