ALTER TABLE "waitlist" ADD COLUMN "referral_code" varchar(8);--> statement-breakpoint
ALTER TABLE "waitlist" ADD COLUMN "referred_by_id" uuid;--> statement-breakpoint
ALTER TABLE "waitlist" ADD COLUMN "referral_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "waitlist" ADD COLUMN "waitlist_position" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "waitlist" ADD CONSTRAINT "waitlist_referred_by_id_waitlist_id_fk" FOREIGN KEY ("referred_by_id") REFERENCES "public"."waitlist"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "waitlist" ADD CONSTRAINT "waitlist_referral_code_unique" UNIQUE("referral_code");