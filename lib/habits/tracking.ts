import type { TrackingType } from "@/types/tracking";

export type TrackingBucket =
  | "boolean"
  | "duration"
  | "volume"
  | "scale"
  | "streak"
  | "time"
  | "note";

const TYPE_TO_BUCKET: Record<TrackingType, TrackingBucket> = {
  boolean: "boolean",
  boolean_optional_text: "boolean",
  number: "volume",
  volume: "volume",
  duration: "duration",
  duration_optional_text: "duration",
  time: "time",
  scale: "scale",
  scale_optional_text: "scale",
  streak: "streak",
  text_required: "note",
  multi_text_required: "note",
};

export const BUCKET_LABEL: Record<TrackingBucket, string> = {
  boolean: "Yes / No",
  duration: "Duration",
  volume: "Volume",
  scale: "Scale",
  streak: "Streak",
  time: "Time",
  note: "Note",
};

/** The tracking buckets offered as sidebar filters (matches the mockup). */
export const FILTER_BUCKETS: TrackingBucket[] = [
  "boolean",
  "duration",
  "volume",
  "streak",
  "scale",
];

export function trackingBucket(type: TrackingType): TrackingBucket {
  return TYPE_TO_BUCKET[type];
}

export function trackingLabel(type: TrackingType): string {
  return BUCKET_LABEL[trackingBucket(type)];
}
