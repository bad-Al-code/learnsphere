ALTER TABLE "lessons" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "modules" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();