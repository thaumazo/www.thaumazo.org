DROP INDEX "password_reset_requests_token_hash_unique";--> statement-breakpoint
ALTER TABLE "password_reset_requests" ALTER COLUMN "token_hash" DROP NOT NULL;--> statement-breakpoint
CREATE INDEX "password_reset_requests_ip_requested_at_idx" ON "password_reset_requests" USING btree ("ip","requested_at");--> statement-breakpoint
CREATE UNIQUE INDEX "password_reset_requests_token_hash_unique" ON "password_reset_requests" USING btree ("token_hash") WHERE "password_reset_requests"."token_hash" IS NOT NULL;