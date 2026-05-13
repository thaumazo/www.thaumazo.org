CREATE TABLE "password_reset_requests" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "password_reset_requests_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"email" varchar(320) NOT NULL,
	"token_hash" varchar(64) NOT NULL,
	"requested_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone,
	"ip" text NOT NULL,
	"user_agent" text,
	"geo" jsonb
);
--> statement-breakpoint
CREATE UNIQUE INDEX "password_reset_requests_token_hash_unique" ON "password_reset_requests" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "password_reset_requests_email_requested_at_idx" ON "password_reset_requests" USING btree ("email","requested_at");--> statement-breakpoint
CREATE INDEX "password_reset_requests_requested_at_idx" ON "password_reset_requests" USING btree ("requested_at");--> statement-breakpoint
CREATE INDEX "password_reset_requests_expires_at_idx" ON "password_reset_requests" USING btree ("expires_at");--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "name";