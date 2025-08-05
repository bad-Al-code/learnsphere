ALTER TABLE "courses" ADD COLUMN "price" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "currency" varchar(3) DEFAULT 'INR';