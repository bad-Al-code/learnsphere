ALTER TABLE "reactions" DROP CONSTRAINT "reactions_message_id_user_id_unique";--> statement-breakpoint
CREATE UNIQUE INDEX "reactions_message_user_upvote_idx" ON "reactions" USING btree ("message_id","user_id") WHERE "reactions"."reaction" = 'upvote';--> statement-breakpoint
CREATE UNIQUE INDEX "reactions_message_user_downvote_idx" ON "reactions" USING btree ("message_id","user_id") WHERE "reactions"."reaction" = 'downvote';--> statement-breakpoint
CREATE UNIQUE INDEX "reactions_message_user_like_idx" ON "reactions" USING btree ("message_id","user_id") WHERE "reactions"."reaction" = 'like';--> statement-breakpoint
CREATE UNIQUE INDEX "reactions_message_user_star_idx" ON "reactions" USING btree ("message_id","user_id") WHERE "reactions"."reaction" = 'star';--> statement-breakpoint
CREATE UNIQUE INDEX "reactions_message_user_heart_idx" ON "reactions" USING btree ("message_id","user_id") WHERE "reactions"."reaction" = 'heart';--> statement-breakpoint
CREATE UNIQUE INDEX "reactions_message_user_sparkles_idx" ON "reactions" USING btree ("message_id","user_id") WHERE "reactions"."reaction" = 'sparkles';