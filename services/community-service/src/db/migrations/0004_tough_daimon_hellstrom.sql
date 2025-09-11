ALTER TABLE "messages" ADD COLUMN "replying_to_message_id" uuid;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "reactions" jsonb;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_replying_to_message_id_messages_id_fk" FOREIGN KEY ("replying_to_message_id") REFERENCES "public"."messages"("id") ON DELETE set null ON UPDATE no action;