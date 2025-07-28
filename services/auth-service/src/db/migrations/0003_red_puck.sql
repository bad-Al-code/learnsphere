ALTER TABLE "users" ADD COLUMN "secure_verification_token" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "secure_password_reset_token" text;