ALTER TABLE "content" DROP CONSTRAINT "content_org_id_organizations_id_fk";
--> statement-breakpoint
DROP INDEX "content_org_slug_unique";--> statement-breakpoint
CREATE UNIQUE INDEX "content_slug_unique" ON "content" USING btree (lower("slug"));--> statement-breakpoint
ALTER TABLE "content" DROP COLUMN "org_id";