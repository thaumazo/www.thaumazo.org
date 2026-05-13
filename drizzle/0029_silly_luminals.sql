CREATE TABLE "service_tags" (
	"service_id" integer NOT NULL,
	"tag_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "services_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"public_id" text NOT NULL,
	"created_by" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"published_at" timestamp with time zone,
	"title" text DEFAULT '' NOT NULL,
	"slug" text DEFAULT '' NOT NULL,
	"image" integer,
	"description" text DEFAULT '' NOT NULL,
	"content" text DEFAULT '' NOT NULL,
	"draft" boolean DEFAULT true NOT NULL,
	"seo_title" text DEFAULT '' NOT NULL,
	"seo_description" text DEFAULT '' NOT NULL,
	CONSTRAINT "services_public_id_unique" UNIQUE("public_id")
);
--> statement-breakpoint
CREATE TABLE "user_services" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_services_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"public_id" text NOT NULL,
	"created_by" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"user_id" integer NOT NULL,
	"service_id" integer NOT NULL,
	"relationship" text NOT NULL,
	CONSTRAINT "user_services_public_id_unique" UNIQUE("public_id")
);
--> statement-breakpoint
ALTER TABLE "service_tags" ADD CONSTRAINT "service_tags_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_tags" ADD CONSTRAINT "service_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_services" ADD CONSTRAINT "user_services_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_services" ADD CONSTRAINT "user_services_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "service_tags_service_id_tag_id_unique" ON "service_tags" USING btree ("service_id","tag_id");--> statement-breakpoint
CREATE INDEX "service_tags_service_id_idx" ON "service_tags" USING btree ("service_id");--> statement-breakpoint
CREATE INDEX "service_tags_tag_id_idx" ON "service_tags" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "services_deleted_at_idx" ON "services" USING btree ("deleted_at") WHERE "services"."deleted_at" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at") WHERE "services"."deleted_at" IS NULL;--> statement-breakpoint
CREATE INDEX "services_published_at_idx" ON "services" USING btree ("published_at") WHERE "services"."deleted_at" IS NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "services_slug_unique" ON "services" USING btree ("slug") WHERE "services"."deleted_at" IS NULL;--> statement-breakpoint
CREATE INDEX "user_services_deleted_at_idx" ON "user_services" USING btree ("deleted_at") WHERE "user_services"."deleted_at" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "user_services_created_at_idx" ON "user_services" USING btree ("created_at") WHERE "user_services"."deleted_at" IS NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "user_services_user_id_service_id_relationship_unique" ON "user_services" USING btree ("user_id","service_id","relationship");--> statement-breakpoint
CREATE INDEX "user_services_user_id_idx" ON "user_services" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_services_service_id_idx" ON "user_services" USING btree ("service_id");