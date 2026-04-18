CREATE TABLE "login_failures" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "login_failures_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"email" varchar(320) NOT NULL,
	"attempted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ip" text,
	"user_agent" text
);
--> statement-breakpoint
CREATE INDEX "login_failures_email_attempted_at_idx" ON "login_failures" USING btree ("email","attempted_at");--> statement-breakpoint
CREATE INDEX "login_failures_ip_attempted_at_idx" ON "login_failures" USING btree ("ip","attempted_at");--> statement-breakpoint
CREATE INDEX "login_failures_attempted_at_idx" ON "login_failures" USING btree ("attempted_at");