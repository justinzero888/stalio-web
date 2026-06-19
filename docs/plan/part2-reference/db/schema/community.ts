import {
  pgTable,
  text,
  integer,
  uuid,
  timestamp,
  pgEnum,
  unique,
} from "drizzle-orm/pg-core";
import { trackingTypeEnum } from "@/db/schema/habits";

// NOTE: Part 2 tables. Defined and migrated now so the schema is stable,
// but no Part 1 code reads or writes them. See docs/plan/part1/DATA_MODEL.md §5.

export const submissionStatusEnum = pgEnum("submission_status", [
  "pending",
  "approved",
  "rejected",
]);

export const postStatusEnum = pgEnum("post_status", [
  "pending",
  "published",
  "rejected",
]);

export const postTypeEnum = pgEnum("post_type", ["story", "question"]);

export const habitSubmissions = pgTable("habit_submissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  nameEn: text("name_en").notNull(),
  categoryGroupEn: text("category_group_en"),
  whatToDoEn: text("what_to_do_en"),
  whyItWorksEn: text("why_it_works_en"),
  twoMinEn: text("two_min_en"),
  trackingType: trackingTypeEnum("tracking_type"),
  submitterName: text("submitter_name"),
  ipHash: text("ip_hash"),
  status: submissionStatusEnum("status").default("pending").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  reviewedBy: text("reviewed_by"),
});

export const communityPosts = pgTable("community_posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  authorName: text("author_name"),
  daysOnStalio: integer("days_on_stalio"),
  postType: postTypeEnum("post_type").default("story").notNull(),
  relatedHabitIds: text("related_habit_ids").array(),
  body: text("body").notNull(),
  likeCount: integer("like_count").default(0).notNull(),
  status: postStatusEnum("status").default("pending").notNull(),
  ipHash: text("ip_hash"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
});

export const postLikes = pgTable(
  "post_likes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    postId: uuid("post_id")
      .notNull()
      .references(() => communityPosts.id, { onDelete: "cascade" }),
    ipHash: text("ip_hash").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => ({
    uniqLike: unique("post_likes_post_ip_unique").on(t.postId, t.ipHash),
  }),
);
