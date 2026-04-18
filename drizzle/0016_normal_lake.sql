ALTER TABLE "audit_logs" RENAME COLUMN "entity_type" TO "table";--> statement-breakpoint
ALTER TABLE "audit_logs" RENAME COLUMN "entity_id" TO "row_id";