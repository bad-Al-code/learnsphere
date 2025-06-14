CREATE TABLE "profiles" (
	"user_id" text PRIMARY KEY NOT NULL,
	"first_name" varchar(50),
	"last_name" varchar(50),
	"bio" text,
	"avatar_url" jsonb,
	"headline" varchar(100),
	"website_url" text,
	"social_links" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
