ALTER TABLE "payments" RENAME COLUMN "order_id" TO "razorpay_order_id";--> statement-breakpoint
ALTER TABLE "payments" RENAME COLUMN "payment_id" TO "razorpay_payment_id";--> statement-breakpoint
ALTER TABLE "payments" RENAME COLUMN "signature" TO "razorpay_signature";--> statement-breakpoint
ALTER TABLE "payments" DROP CONSTRAINT "payments_order_id_unique";--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "status" SET DEFAULT 'pending'::text;--> statement-breakpoint
DROP TYPE "public"."payment_status";--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'completed', 'failed');--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "status" SET DEFAULT 'pending'::"public"."payment_status";--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "status" SET DATA TYPE "public"."payment_status" USING "status"::"public"."payment_status";--> statement-breakpoint
DROP INDEX "user_course_unique_idx";--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "currency" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "currency" SET DEFAULT 'INR';--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "title" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_razorpay_order_id_unique" UNIQUE("razorpay_order_id");--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_razorpay_payment_id_unique" UNIQUE("razorpay_payment_id");