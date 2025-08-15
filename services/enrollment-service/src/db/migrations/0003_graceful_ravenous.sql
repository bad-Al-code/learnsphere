ALTER TABLE "courses" ADD COLUMN "price" numeric(10, 2) DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "currency" varchar(3) DEFAULT 'INR';