DROP INDEX "content_slug_unique";--> statement-breakpoint
CREATE UNIQUE INDEX "content_slug_unique" ON "content" USING btree ("slug");