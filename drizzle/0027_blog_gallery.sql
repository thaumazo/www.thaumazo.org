CREATE TABLE "blog_images" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "blog_images_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"public_id" text NOT NULL,
	"created_by" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"blog_id" integer NOT NULL,
	"image_id" integer NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "blog_images_public_id_unique" UNIQUE("public_id")
);
--> statement-breakpoint
ALTER TABLE "blog_images" ADD CONSTRAINT "blog_images_blog_id_blogs_id_fk" FOREIGN KEY ("blog_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_images" ADD CONSTRAINT "blog_images_image_id_images_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."images"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "blog_images_deleted_at_idx" ON "blog_images" USING btree ("deleted_at") WHERE "blog_images"."deleted_at" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "blog_images_created_at_idx" ON "blog_images" USING btree ("created_at") WHERE "blog_images"."deleted_at" IS NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "blog_images_blog_id_image_id_unique" ON "blog_images" USING btree ("blog_id","image_id");--> statement-breakpoint
CREATE INDEX "blog_images_blog_id_sort_order_idx" ON "blog_images" USING btree ("blog_id","sort_order");