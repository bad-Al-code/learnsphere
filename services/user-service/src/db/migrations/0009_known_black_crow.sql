CREATE TYPE "public"."flashcard_progress_status" AS ENUM('New', 'Learning', 'Mastered');--> statement-breakpoint
CREATE TABLE "ai_flashcard_decks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"course_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_flashcards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"deck_id" uuid NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_flashcard_progress" (
	"user_id" text NOT NULL,
	"card_id" uuid NOT NULL,
	"deck_id" uuid NOT NULL,
	"status" "flashcard_progress_status" DEFAULT 'New' NOT NULL,
	"next_review_at" timestamp DEFAULT now() NOT NULL,
	"last_reviewed_at" timestamp,
	"correct_streaks" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "user_flashcard_progress_user_id_card_id_pk" PRIMARY KEY("user_id","card_id")
);
--> statement-breakpoint
ALTER TABLE "ai_flashcard_decks" ADD CONSTRAINT "ai_flashcard_decks_user_id_profiles_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_flashcards" ADD CONSTRAINT "ai_flashcards_deck_id_ai_flashcard_decks_id_fk" FOREIGN KEY ("deck_id") REFERENCES "public"."ai_flashcard_decks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_flashcard_progress" ADD CONSTRAINT "user_flashcard_progress_user_id_profiles_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_flashcard_progress" ADD CONSTRAINT "user_flashcard_progress_card_id_ai_flashcards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."ai_flashcards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_flashcard_progress" ADD CONSTRAINT "user_flashcard_progress_deck_id_ai_flashcard_decks_id_fk" FOREIGN KEY ("deck_id") REFERENCES "public"."ai_flashcard_decks"("id") ON DELETE cascade ON UPDATE no action;