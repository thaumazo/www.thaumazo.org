ALTER TABLE "revisions" ADD COLUMN "changes" text[];--> statement-breakpoint
UPDATE "revisions" SET "changes" = '{}'::text[] WHERE "changes" IS NULL;--> statement-breakpoint
ALTER TABLE "revisions" ALTER COLUMN "changes" SET NOT NULL;
