CREATE TABLE "ai_learning_efficiency" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"efficiency_data" jsonb NOT NULL,
	"generated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ai_learning_efficiency_user_id_unique" UNIQUE("user_id")
);
