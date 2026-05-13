CREATE TABLE "content" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "content_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"slug" text NOT NULL,
	"title" text,
	"description" text,
	"image" jsonb,
	"content" text,
	"seo_title" text,
	"seo_description" text,
	"data" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"org_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "content" ADD CONSTRAINT "content_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "content_org_slug_unique" ON "content" USING btree ("org_id",lower("slug"));