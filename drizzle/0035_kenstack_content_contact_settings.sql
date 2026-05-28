-- Custom SQL migration file, put your code below! --
DO $$
BEGIN
  IF to_regclass('public.blog_images') IS NOT NULL
    AND to_regclass('public.blog_media') IS NULL THEN
    ALTER TABLE "blog_images" RENAME TO "blog_media";
  END IF;
END $$;--> statement-breakpoint
DO $$
BEGIN
  IF to_regclass('public.blog_images_blog_id_image_id_unique') IS NOT NULL
    AND to_regclass('public.blog_media_blog_id_image_id_unique') IS NULL THEN
    ALTER INDEX "blog_images_blog_id_image_id_unique" RENAME TO "blog_media_blog_id_image_id_unique";
  END IF;
END $$;--> statement-breakpoint
DO $$
BEGIN
  IF to_regclass('public.blog_images_blog_id_sort_order_idx') IS NOT NULL
    AND to_regclass('public.blog_media_blog_id_sort_order_idx') IS NULL THEN
    ALTER INDEX "blog_images_blog_id_sort_order_idx" RENAME TO "blog_media_blog_id_sort_order_idx";
  END IF;
END $$;--> statement-breakpoint
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'blog_images_blog_id_blog_id_fk'
      AND conrelid = 'public.blog_media'::regclass
  ) THEN
    ALTER TABLE "blog_media" RENAME CONSTRAINT "blog_images_blog_id_blog_id_fk" TO "blog_media_blog_id_blog_id_fk";
  END IF;
END $$;--> statement-breakpoint
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'blog_images_image_id_images_id_fk'
      AND conrelid = 'public.blog_media'::regclass
  ) THEN
    ALTER TABLE "blog_media" RENAME CONSTRAINT "blog_images_image_id_images_id_fk" TO "blog_media_image_id_images_id_fk";
  END IF;
END $$;--> statement-breakpoint
ALTER TABLE "content" ADD COLUMN IF NOT EXISTS "image" integer;--> statement-breakpoint
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'content'
      AND column_name = 'image'
      AND udt_name = 'jsonb'
  ) THEN
    ALTER TABLE "content" ALTER COLUMN "image" TYPE integer USING
      CASE
        WHEN jsonb_typeof("image") = 'object'
          AND "image" ? 'id'
          AND ("image"->>'id') ~ '^[0-9]+$'
          THEN ("image"->>'id')::integer
        ELSE NULL
      END;
  END IF;
END $$;--> statement-breakpoint
ALTER TABLE "content" ADD COLUMN IF NOT EXISTS "og_image" integer;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "contact_settings" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "key" text NOT NULL UNIQUE,
  "created_by" integer,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  "to" text NOT NULL,
  "subject" text NOT NULL
);
