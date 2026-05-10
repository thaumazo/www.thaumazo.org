ALTER TABLE "images" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."image_status";--> statement-breakpoint
CREATE TYPE "public"."image_status" AS ENUM('pending', 'uploaded', 'attached', 'removed');--> statement-breakpoint
ALTER TABLE "images" ALTER COLUMN "status" SET DATA TYPE "public"."image_status" USING "status"::"public"."image_status";