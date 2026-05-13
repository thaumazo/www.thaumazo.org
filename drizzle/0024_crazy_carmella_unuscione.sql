ALTER TABLE "sessions" ADD COLUMN "impersonated_by" integer;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD COLUMN "impersonated_by" integer;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_impersonated_by_users_id_fk" FOREIGN KEY ("impersonated_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;