CREATE TABLE "ai_performance_predictions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"predictions" jsonb NOT NULL,
	"generated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ai_performance_predictions_user_id_unique" UNIQUE("user_id")
);
