CREATE TABLE "organization_tags" (
	"organization_id" integer NOT NULL,
	"tag_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "organizations_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
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
	"url" text DEFAULT '' NOT NULL,
	"kind" text[] DEFAULT '{}' NOT NULL,
	"sdgs" text[] DEFAULT '{}' NOT NULL,
	"seo_title" text DEFAULT '' NOT NULL,
	"seo_description" text DEFAULT '' NOT NULL,
	CONSTRAINT "organizations_public_id_unique" UNIQUE("public_id")
);
--> statement-breakpoint
CREATE TABLE "user_organizations" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_organizations_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"public_id" text NOT NULL,
	"created_by" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"user_id" integer NOT NULL,
	"organization_id" integer NOT NULL,
	"relationship" text NOT NULL,
	CONSTRAINT "user_organizations_public_id_unique" UNIQUE("public_id")
);
--> statement-breakpoint
CREATE TABLE "project_organizations" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "project_organizations_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"public_id" text NOT NULL,
	"created_by" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"project_id" integer NOT NULL,
	"organization_id" integer NOT NULL,
	"relationship" text NOT NULL,
	CONSTRAINT "project_organizations_public_id_unique" UNIQUE("public_id")
);
--> statement-breakpoint
CREATE TABLE "project_tags" (
	"project_id" integer NOT NULL,
	"tag_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "projects_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
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
	"url" text DEFAULT '' NOT NULL,
	"location" text DEFAULT '' NOT NULL,
	"start_date" timestamp with time zone,
	"end_date" timestamp with time zone,
	"status" text DEFAULT 'Proposed' NOT NULL,
	"kind" text[] DEFAULT '{}' NOT NULL,
	"sdgs" text[] DEFAULT '{}' NOT NULL,
	"seo_title" text DEFAULT '' NOT NULL,
	"seo_description" text DEFAULT '' NOT NULL,
	CONSTRAINT "projects_public_id_unique" UNIQUE("public_id")
);
--> statement-breakpoint
CREATE TABLE "user_projects" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_projects_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"public_id" text NOT NULL,
	"created_by" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"user_id" integer NOT NULL,
	"project_id" integer NOT NULL,
	"relationship" text NOT NULL,
	CONSTRAINT "user_projects_public_id_unique" UNIQUE("public_id")
);
--> statement-breakpoint
ALTER TABLE "blogs" ALTER COLUMN "title" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "blogs" ALTER COLUMN "slug" SET DEFAULT '';--> statement-breakpoint
UPDATE "blogs" SET "description" = '' WHERE "description" IS NULL;--> statement-breakpoint
UPDATE "blogs" SET "content" = '' WHERE "content" IS NULL;--> statement-breakpoint
UPDATE "blogs" SET "seo_title" = '' WHERE "seo_title" IS NULL;--> statement-breakpoint
UPDATE "blogs" SET "seo_description" = '' WHERE "seo_description" IS NULL;--> statement-breakpoint
ALTER TABLE "blogs" ALTER COLUMN "description" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "blogs" ALTER COLUMN "description" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "blogs" ALTER COLUMN "content" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "blogs" ALTER COLUMN "content" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "blogs" ALTER COLUMN "seo_title" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "blogs" ALTER COLUMN "seo_title" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "blogs" ALTER COLUMN "seo_description" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "blogs" ALTER COLUMN "seo_description" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "title" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "slug" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "published_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "description" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "content" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "draft" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "linkedin" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "community_roles" text[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "seo_title" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "seo_description" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "organization_tags" ADD CONSTRAINT "organization_tags_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_tags" ADD CONSTRAINT "organization_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_organizations" ADD CONSTRAINT "user_organizations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_organizations" ADD CONSTRAINT "user_organizations_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_organizations" ADD CONSTRAINT "project_organizations_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_organizations" ADD CONSTRAINT "project_organizations_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_tags" ADD CONSTRAINT "project_tags_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_tags" ADD CONSTRAINT "project_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_projects" ADD CONSTRAINT "user_projects_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_projects" ADD CONSTRAINT "user_projects_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "organization_tags_organization_id_tag_id_unique" ON "organization_tags" USING btree ("organization_id","tag_id");--> statement-breakpoint
CREATE INDEX "organization_tags_organization_id_idx" ON "organization_tags" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "organization_tags_tag_id_idx" ON "organization_tags" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "organizations_deleted_at_idx" ON "organizations" USING btree ("deleted_at") WHERE "organizations"."deleted_at" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "organizations_created_at_idx" ON "organizations" USING btree ("created_at") WHERE "organizations"."deleted_at" IS NULL;--> statement-breakpoint
CREATE INDEX "organizations_published_at_idx" ON "organizations" USING btree ("published_at") WHERE "organizations"."deleted_at" IS NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "organizations_slug_unique" ON "organizations" USING btree ("slug") WHERE "organizations"."deleted_at" IS NULL;--> statement-breakpoint
CREATE INDEX "user_organizations_deleted_at_idx" ON "user_organizations" USING btree ("deleted_at") WHERE "user_organizations"."deleted_at" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "user_organizations_created_at_idx" ON "user_organizations" USING btree ("created_at") WHERE "user_organizations"."deleted_at" IS NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "user_organizations_user_id_organization_id_relationship_unique" ON "user_organizations" USING btree ("user_id","organization_id","relationship");--> statement-breakpoint
CREATE INDEX "user_organizations_user_id_idx" ON "user_organizations" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_organizations_organization_id_idx" ON "user_organizations" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "project_organizations_deleted_at_idx" ON "project_organizations" USING btree ("deleted_at") WHERE "project_organizations"."deleted_at" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "project_organizations_created_at_idx" ON "project_organizations" USING btree ("created_at") WHERE "project_organizations"."deleted_at" IS NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "project_organizations_project_id_organization_id_relationship_unique" ON "project_organizations" USING btree ("project_id","organization_id","relationship");--> statement-breakpoint
CREATE INDEX "project_organizations_project_id_idx" ON "project_organizations" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "project_organizations_organization_id_idx" ON "project_organizations" USING btree ("organization_id");--> statement-breakpoint
CREATE UNIQUE INDEX "project_tags_project_id_tag_id_unique" ON "project_tags" USING btree ("project_id","tag_id");--> statement-breakpoint
CREATE INDEX "project_tags_project_id_idx" ON "project_tags" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "project_tags_tag_id_idx" ON "project_tags" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "projects_deleted_at_idx" ON "projects" USING btree ("deleted_at") WHERE "projects"."deleted_at" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at") WHERE "projects"."deleted_at" IS NULL;--> statement-breakpoint
CREATE INDEX "projects_published_at_idx" ON "projects" USING btree ("published_at") WHERE "projects"."deleted_at" IS NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "projects_slug_unique" ON "projects" USING btree ("slug") WHERE "projects"."deleted_at" IS NULL;--> statement-breakpoint
CREATE INDEX "user_projects_deleted_at_idx" ON "user_projects" USING btree ("deleted_at") WHERE "user_projects"."deleted_at" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "user_projects_created_at_idx" ON "user_projects" USING btree ("created_at") WHERE "user_projects"."deleted_at" IS NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "user_projects_user_id_project_id_relationship_unique" ON "user_projects" USING btree ("user_id","project_id","relationship");--> statement-breakpoint
CREATE INDEX "user_projects_user_id_idx" ON "user_projects" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_projects_project_id_idx" ON "user_projects" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "users_published_at_idx" ON "users" USING btree ("published_at") WHERE "users"."deleted_at" IS NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "users_slug_unique" ON "users" USING btree ("slug") WHERE "users"."deleted_at" IS NULL AND "users"."slug" IS NOT NULL;
