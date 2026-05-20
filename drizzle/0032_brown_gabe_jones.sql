CREATE TABLE "revisions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "revisions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"table" varchar(64) NOT NULL,
	"row_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" integer,
	"snapshot" jsonb NOT NULL
);
--> statement-breakpoint
ALTER TABLE "blog_images" DROP CONSTRAINT "blog_images_public_id_unique";--> statement-breakpoint
DROP INDEX "blog_images_deleted_at_idx";--> statement-breakpoint
DROP INDEX "blog_images_created_at_idx";--> statement-breakpoint
CREATE INDEX "revisions_table_row_created_at_idx" ON "revisions" USING btree ("table","row_id","created_at");--> statement-breakpoint
ALTER TABLE "blog_images" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "blog_images" DROP COLUMN "public_id";--> statement-breakpoint
ALTER TABLE "blog_images" DROP COLUMN "created_by";--> statement-breakpoint
ALTER TABLE "blog_images" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "blog_images" DROP COLUMN "updated_at";--> statement-breakpoint
ALTER TABLE "blog_images" DROP COLUMN "deleted_at";