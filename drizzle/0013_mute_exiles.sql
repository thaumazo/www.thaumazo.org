CREATE TABLE "blogs" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "blogs_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"image" jsonb,
	"description" text,
	"content" text,
	"date" timestamp with time zone DEFAULT now() NOT NULL,
	"draft" boolean NOT NULL,
	"seo_title" text,
	"seo_description" text
);
--> statement-breakpoint
DROP TABLE "organization_members" CASCADE;--> statement-breakpoint
DROP TABLE "organizations" CASCADE;--> statement-breakpoint
CREATE INDEX "blogs_deleted_at_idx" ON "blogs" USING btree ("deleted_at") WHERE "blogs"."deleted_at" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "blogs_created_at_idx" ON "blogs" USING btree ("created_at") WHERE "blogs"."deleted_at" IS NULL;--> statement-breakpoint
CREATE INDEX "blogs_date_idx" ON "blogs" USING btree ("date") WHERE "blogs"."deleted_at" IS NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "blogs_slug_unique" ON "blogs" USING btree ("slug") WHERE "blogs"."deleted_at" IS NULL;