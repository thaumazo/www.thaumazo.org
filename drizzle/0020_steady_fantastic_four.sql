CREATE TYPE "public"."image_kind" AS ENUM('raster', 'svg');--> statement-breakpoint
CREATE TYPE "public"."image_status" AS ENUM('pending', 'attached', 'removed');--> statement-breakpoint
CREATE TABLE "images" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "images_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"public_id" text NOT NULL,
	"created_by" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"status" "image_status" NOT NULL,
	"kind" "image_kind" NOT NULL,
	"filename" text NOT NULL,
	"prefix" text NOT NULL,
	"base_name" text NOT NULL,
	"alt" text,
	"source_key" text NOT NULL,
	"source_url" text NOT NULL,
	"source_type" text NOT NULL,
	"source_size" integer,
	"source_width" integer,
	"source_height" integer,
	"variants" jsonb,
	CONSTRAINT "images_public_id_unique" UNIQUE("public_id")
);
--> statement-breakpoint
DROP INDEX "users_search_idx";--> statement-breakpoint
DROP INDEX "blogs_search_idx";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE varchar(320);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "avatar" SET DATA TYPE integer USING NULL::integer;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "roles" SET DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "blogs" ALTER COLUMN "image" SET DATA TYPE integer USING NULL::integer;--> statement-breakpoint
ALTER TABLE "blogs" ALTER COLUMN "description" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "blogs" ALTER COLUMN "content" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "blogs" ALTER COLUMN "seo_title" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "blogs" ALTER COLUMN "seo_description" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "blogs" ADD COLUMN "public_id" text;--> statement-breakpoint
UPDATE "blogs" SET "public_id" = 'blog-' || "id"::text WHERE "public_id" IS NULL;--> statement-breakpoint
ALTER TABLE "blogs" ALTER COLUMN "public_id" SET NOT NULL;--> statement-breakpoint
CREATE INDEX "images_deleted_at_idx" ON "images" USING btree ("deleted_at") WHERE "images"."deleted_at" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "images_created_at_idx" ON "images" USING btree ("created_at") WHERE "images"."deleted_at" IS NULL;--> statement-breakpoint
CREATE INDEX "images_status_idx" ON "images" USING btree ("status");--> statement-breakpoint
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_public_id_unique" UNIQUE("public_id");