DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'image_kind')
    AND NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'media_kind') THEN
    ALTER TYPE "public"."image_kind" RENAME TO "media_kind";
  END IF;
END $$;--> statement-breakpoint
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'image_status')
    AND NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'media_status') THEN
    ALTER TYPE "public"."image_status" RENAME TO "media_status";
  END IF;
END $$;--> statement-breakpoint
DO $$
BEGIN
  IF to_regclass('public.images') IS NOT NULL
    AND to_regclass('public.media') IS NULL THEN
    ALTER TABLE "images" RENAME TO "media";
  END IF;
END $$;--> statement-breakpoint
DO $$
BEGIN
  IF to_regclass('public.images_id_seq') IS NOT NULL
    AND to_regclass('public.media_id_seq') IS NULL THEN
    ALTER SEQUENCE "images_id_seq" RENAME TO "media_id_seq";
  END IF;
END $$;--> statement-breakpoint
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'images_pkey'
      AND conrelid = 'public.media'::regclass
  )
    AND NOT EXISTS (
      SELECT 1
      FROM pg_constraint
      WHERE conname = 'media_pkey'
        AND conrelid = 'public.media'::regclass
    ) THEN
    ALTER TABLE "media" RENAME CONSTRAINT "images_pkey" TO "media_pkey";
  END IF;
END $$;--> statement-breakpoint
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'images_public_id_unique'
      AND conrelid = 'public.media'::regclass
  )
    AND NOT EXISTS (
      SELECT 1
      FROM pg_constraint
      WHERE conname = 'media_public_id_unique'
        AND conrelid = 'public.media'::regclass
    ) THEN
    ALTER TABLE "media" RENAME CONSTRAINT "images_public_id_unique" TO "media_public_id_unique";
  END IF;
END $$;--> statement-breakpoint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'media_public_id_unique'
      AND conrelid = 'public.media'::regclass
  ) THEN
    ALTER TABLE "media" ADD CONSTRAINT "media_public_id_unique" UNIQUE("public_id");
  END IF;
END $$;--> statement-breakpoint
DO $$
BEGIN
  IF to_regclass('public.images_deleted_at_idx') IS NOT NULL
    AND to_regclass('public.media_deleted_at_idx') IS NULL THEN
    ALTER INDEX "images_deleted_at_idx" RENAME TO "media_deleted_at_idx";
  END IF;
END $$;--> statement-breakpoint
DO $$
BEGIN
  IF to_regclass('public.images_created_at_idx') IS NOT NULL
    AND to_regclass('public.media_created_at_idx') IS NULL THEN
    ALTER INDEX "images_created_at_idx" RENAME TO "media_created_at_idx";
  END IF;
END $$;--> statement-breakpoint
DO $$
BEGIN
  IF to_regclass('public.images_status_idx') IS NOT NULL
    AND to_regclass('public.media_status_idx') IS NULL THEN
    ALTER INDEX "images_status_idx" RENAME TO "media_status_idx";
  END IF;
END $$;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "media_deleted_at_idx" ON "media" USING btree ("deleted_at") WHERE "media"."deleted_at" IS NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "media_created_at_idx" ON "media" USING btree ("created_at") WHERE "media"."deleted_at" IS NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "media_status_idx" ON "media" USING btree ("status");--> statement-breakpoint
DO $$
BEGIN
  IF to_regclass('public.blog_images') IS NOT NULL
    AND to_regclass('public.blog_media') IS NULL THEN
    ALTER TABLE "blog_images" RENAME TO "blog_media";
  END IF;
END $$;--> statement-breakpoint
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'blog_media'
      AND column_name = 'image_id'
  )
    AND NOT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'blog_media'
        AND column_name = 'media_id'
    ) THEN
    ALTER TABLE "blog_media" RENAME COLUMN "image_id" TO "media_id";
  END IF;
END $$;--> statement-breakpoint
DO $$
BEGIN
  IF to_regclass('public.blog_images_blog_id_image_id_unique') IS NOT NULL
    AND to_regclass('public.blog_media_unique') IS NULL THEN
    ALTER INDEX "blog_images_blog_id_image_id_unique" RENAME TO "blog_media_unique";
  END IF;
END $$;--> statement-breakpoint
DO $$
BEGIN
  IF to_regclass('public.blog_media_blog_id_image_id_unique') IS NOT NULL
    AND to_regclass('public.blog_media_unique') IS NULL THEN
    ALTER INDEX "blog_media_blog_id_image_id_unique" RENAME TO "blog_media_unique";
  END IF;
END $$;--> statement-breakpoint
DO $$
BEGIN
  IF to_regclass('public.blog_images_blog_id_sort_order_idx') IS NOT NULL
    AND to_regclass('public.blog_media_sort_order_idx') IS NULL THEN
    ALTER INDEX "blog_images_blog_id_sort_order_idx" RENAME TO "blog_media_sort_order_idx";
  END IF;
END $$;--> statement-breakpoint
DO $$
BEGIN
  IF to_regclass('public.blog_media_blog_id_sort_order_idx') IS NOT NULL
    AND to_regclass('public.blog_media_sort_order_idx') IS NULL THEN
    ALTER INDEX "blog_media_blog_id_sort_order_idx" RENAME TO "blog_media_sort_order_idx";
  END IF;
END $$;--> statement-breakpoint
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'blog_images_blog_id_blog_id_fk'
      AND conrelid = 'public.blog_media'::regclass
  )
    AND NOT EXISTS (
      SELECT 1
      FROM pg_constraint
      WHERE conname = 'blog_media_blog_fk'
        AND conrelid = 'public.blog_media'::regclass
    ) THEN
    ALTER TABLE "blog_media" RENAME CONSTRAINT "blog_images_blog_id_blog_id_fk" TO "blog_media_blog_fk";
  END IF;
END $$;--> statement-breakpoint
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'blog_media_blog_id_blog_id_fk'
      AND conrelid = 'public.blog_media'::regclass
  )
    AND NOT EXISTS (
      SELECT 1
      FROM pg_constraint
      WHERE conname = 'blog_media_blog_fk'
        AND conrelid = 'public.blog_media'::regclass
    ) THEN
    ALTER TABLE "blog_media" RENAME CONSTRAINT "blog_media_blog_id_blog_id_fk" TO "blog_media_blog_fk";
  END IF;
END $$;--> statement-breakpoint
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'blog_images_image_id_images_id_fk'
      AND conrelid = 'public.blog_media'::regclass
  )
    AND NOT EXISTS (
      SELECT 1
      FROM pg_constraint
      WHERE conname = 'blog_media_media_fk'
        AND conrelid = 'public.blog_media'::regclass
    ) THEN
    ALTER TABLE "blog_media" RENAME CONSTRAINT "blog_images_image_id_images_id_fk" TO "blog_media_media_fk";
  END IF;
END $$;--> statement-breakpoint
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'blog_media_image_id_images_id_fk'
      AND conrelid = 'public.blog_media'::regclass
  )
    AND NOT EXISTS (
      SELECT 1
      FROM pg_constraint
      WHERE conname = 'blog_media_media_fk'
        AND conrelid = 'public.blog_media'::regclass
    ) THEN
    ALTER TABLE "blog_media" RENAME CONSTRAINT "blog_media_image_id_images_id_fk" TO "blog_media_media_fk";
  END IF;
END $$;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "blog_media_unique" ON "blog_media" USING btree ("blog_id","media_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "blog_media_sort_order_idx" ON "blog_media" USING btree ("blog_id","sort_order");--> statement-breakpoint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'blog_media_blog_fk'
      AND conrelid = 'public.blog_media'::regclass
  ) THEN
    ALTER TABLE "blog_media" ADD CONSTRAINT "blog_media_blog_fk" FOREIGN KEY ("blog_id") REFERENCES "public"."blog"("id") ON DELETE cascade ON UPDATE no action;
  END IF;
END $$;--> statement-breakpoint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'blog_media_media_fk'
      AND conrelid = 'public.blog_media'::regclass
  ) THEN
    ALTER TABLE "blog_media" ADD CONSTRAINT "blog_media_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  END IF;
END $$;
