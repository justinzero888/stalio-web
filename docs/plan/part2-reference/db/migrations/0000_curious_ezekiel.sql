CREATE TYPE "public"."color_group" AS ENUM('health', 'mental', 'productivity', 'financial', 'social', 'home');--> statement-breakpoint
CREATE TYPE "public"."difficulty" AS ENUM('easy', 'moderate', 'hard');--> statement-breakpoint
CREATE TYPE "public"."tracking_type" AS ENUM('boolean', 'boolean_optional_text', 'number', 'volume', 'duration', 'duration_optional_text', 'time', 'scale', 'scale_optional_text', 'streak', 'text_required', 'multi_text_required');--> statement-breakpoint
CREATE TYPE "public"."post_status" AS ENUM('pending', 'published', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."post_type" AS ENUM('story', 'question');--> statement-breakpoint
CREATE TYPE "public"."submission_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TABLE "habits" (
	"habit_id" text PRIMARY KEY NOT NULL,
	"name_en" text NOT NULL,
	"name_cn" text,
	"category_group_en" text NOT NULL,
	"category_group_cn" text,
	"category_name_en" text NOT NULL,
	"category_name_cn" text,
	"subcategory" text,
	"color_group" "color_group" NOT NULL,
	"what_to_do_en" text,
	"what_to_do_cn" text,
	"why_it_works_en" text,
	"why_it_works_cn" text,
	"two_min_en" text,
	"two_min_cn" text,
	"anatomy_cue_en" text,
	"anatomy_behaviour_en" text,
	"anatomy_reward_en" text,
	"research_backing_en" text,
	"research_source_url" text,
	"tracking_type" "tracking_type" NOT NULL,
	"tracking_unit" text,
	"tracking_default_target" integer,
	"tracking_min" integer,
	"tracking_max" integer,
	"tracking_increment" integer,
	"custom_target_allowed" boolean DEFAULT false NOT NULL,
	"time_of_day" text,
	"estimated_duration_min" integer,
	"difficulty" "difficulty" NOT NULL,
	"is_default_bundle" boolean DEFAULT false NOT NULL,
	"notes_for_product" text,
	"is_published" boolean DEFAULT true NOT NULL,
	"sort_order" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "community_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"author_name" text,
	"days_on_stalio" integer,
	"post_type" "post_type" DEFAULT 'story' NOT NULL,
	"related_habit_ids" text[],
	"body" text NOT NULL,
	"like_count" integer DEFAULT 0 NOT NULL,
	"status" "post_status" DEFAULT 'pending' NOT NULL,
	"ip_hash" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"reviewed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "habit_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name_en" text NOT NULL,
	"category_group_en" text,
	"what_to_do_en" text,
	"why_it_works_en" text,
	"two_min_en" text,
	"tracking_type" "tracking_type",
	"submitter_name" text,
	"ip_hash" text,
	"status" "submission_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"reviewed_at" timestamp with time zone,
	"reviewed_by" text
);
--> statement-breakpoint
CREATE TABLE "post_likes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"ip_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "post_likes_post_ip_unique" UNIQUE("post_id","ip_hash")
);
--> statement-breakpoint
ALTER TABLE "post_likes" ADD CONSTRAINT "post_likes_post_id_community_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."community_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
-- RLS: defense-in-depth (ADR-1). Server writes use Drizzle service-role and bypass RLS.
ALTER TABLE "habits" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "habits_anon_read_published" ON "habits" FOR SELECT TO anon USING ("is_published" = true);