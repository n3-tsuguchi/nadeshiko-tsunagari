import { supabase } from "./supabase";
import type { CircularNotice, Event } from "@/types";

// ─── 回覧板 ───────────────────────────────────────────

export async function fetchCirculars(): Promise<CircularNotice[]> {
  const { data: circulars, error } = await supabase
    .from("circulars")
    .select("*")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch circulars:", error);
    return [];
  }

  // 既読情報を取得（認証なしの場合は空配列）
  const { data: reads } = await supabase
    .from("circular_reads")
    .select("circular_id, user_id");

  const readMap = new Map<string, string[]>();
  for (const r of reads ?? []) {
    const list = readMap.get(r.circular_id) ?? [];
    list.push(r.user_id);
    readMap.set(r.circular_id, list);
  }

  return circulars.map((c) => ({
    id: c.id,
    title: c.title,
    content: c.content,
    category: c.category as CircularNotice["category"],
    publishedAt: c.published_at,
    readBy: readMap.get(c.id) ?? [],
    attachmentUrl: c.attachment_url ?? undefined,
    isUrgent: c.is_urgent,
  }));
}

export async function fetchCircularById(
  id: string
): Promise<CircularNotice | null> {
  const { data, error } = await supabase
    .from("circulars")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;

  const { data: reads } = await supabase
    .from("circular_reads")
    .select("user_id")
    .eq("circular_id", id);

  return {
    id: data.id,
    title: data.title,
    content: data.content,
    category: data.category as CircularNotice["category"],
    publishedAt: data.published_at,
    readBy: (reads ?? []).map((r) => r.user_id),
    attachmentUrl: data.attachment_url ?? undefined,
    isUrgent: data.is_urgent,
  };
}

// ─── イベント ───────────────────────────────────────────

export async function fetchEvents(): Promise<Event[]> {
  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .order("date", { ascending: true });

  if (error) {
    console.error("Failed to fetch events:", error);
    return [];
  }

  // 参加者数を集計
  const { data: participations } = await supabase
    .from("event_participations")
    .select("event_id");

  const countMap = new Map<string, number>();
  for (const p of participations ?? []) {
    countMap.set(p.event_id, (countMap.get(p.event_id) ?? 0) + 1);
  }

  return events.map((e) => ({
    id: e.id,
    title: e.title,
    description: e.description,
    date: e.date,
    startTime: e.start_time,
    endTime: e.end_time,
    location: e.location,
    organizer: e.organizer,
    category: e.category as Event["category"],
    maxParticipants: e.max_participants ?? undefined,
    currentParticipants: countMap.get(e.id) ?? 0,
    imageUrl: e.image_url ?? undefined,
  }));
}

export async function fetchEventById(id: string): Promise<Event | null> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;

  const { data: participations } = await supabase
    .from("event_participations")
    .select("event_id")
    .eq("event_id", id);

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    date: data.date,
    startTime: data.start_time,
    endTime: data.end_time,
    location: data.location,
    organizer: data.organizer,
    category: data.category as Event["category"],
    maxParticipants: data.max_participants ?? undefined,
    currentParticipants: participations?.length ?? 0,
    imageUrl: data.image_url ?? undefined,
  };
}

// ─── 回覧板 編集・削除 ───────────────────────────────────

export async function updateCircular(
  id: string,
  fields: {
    title: string;
    content: string;
    category: CircularNotice["category"];
    is_urgent: boolean;
    attachment_url?: string | null;
  }
) {
  const { error } = await supabase
    .from("circulars")
    .update(fields)
    .eq("id", id);
  if (error) console.error("Failed to update circular:", error);
  return !error;
}

export async function deleteCircular(id: string) {
  const { error } = await supabase.from("circulars").delete().eq("id", id);
  if (error) console.error("Failed to delete circular:", error);
  return !error;
}

// ─── イベント 編集・削除 ─────────────────────────────────

export async function updateEvent(
  id: string,
  fields: {
    title: string;
    description: string;
    date: string;
    start_time: string;
    end_time: string;
    location: string;
    organizer: string;
    category: Event["category"];
    max_participants?: number | null;
    image_url?: string | null;
  }
) {
  const { error } = await supabase
    .from("events")
    .update(fields)
    .eq("id", id);
  if (error) console.error("Failed to update event:", error);
  return !error;
}

export async function deleteEvent(id: string) {
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) console.error("Failed to delete event:", error);
  return !error;
}

// ─── 検索 ───────────────────────────────────────────────

export async function searchCirculars(
  query: string
): Promise<CircularNotice[]> {
  const { data: circulars, error } = await supabase
    .from("circulars")
    .select("*")
    .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    .order("published_at", { ascending: false });

  if (error || !circulars) return [];

  const { data: reads } = await supabase
    .from("circular_reads")
    .select("circular_id, user_id");

  const readMap = new Map<string, string[]>();
  for (const r of reads ?? []) {
    const list = readMap.get(r.circular_id) ?? [];
    list.push(r.user_id);
    readMap.set(r.circular_id, list);
  }

  return circulars.map((c) => ({
    id: c.id,
    title: c.title,
    content: c.content,
    category: c.category as CircularNotice["category"],
    publishedAt: c.published_at,
    readBy: readMap.get(c.id) ?? [],
    attachmentUrl: c.attachment_url ?? undefined,
    isUrgent: c.is_urgent,
  }));
}

// ─── 既読操作 ───────────────────────────────────────────

export async function markAsRead(circularId: string, userId: string) {
  const { error } = await supabase
    .from("circular_reads")
    .insert({ circular_id: circularId, user_id: userId });

  if (error && error.code !== "23505") {
    // 23505 = unique violation (already read)
    console.error("Failed to mark as read:", error);
  }
}

export async function markAsUnread(circularId: string, userId: string) {
  const { error } = await supabase
    .from("circular_reads")
    .delete()
    .eq("circular_id", circularId)
    .eq("user_id", userId);

  if (error) {
    console.error("Failed to mark as unread:", error);
  }
}

// ─── イベント参加操作 ──────────────────────────────────

export async function joinEvent(eventId: string, userId: string) {
  const { error } = await supabase
    .from("event_participations")
    .insert({ event_id: eventId, user_id: userId });

  if (error && error.code !== "23505") {
    console.error("Failed to join event:", error);
  }
}

export async function leaveEvent(eventId: string, userId: string) {
  const { error } = await supabase
    .from("event_participations")
    .delete()
    .eq("event_id", eventId)
    .eq("user_id", userId);

  if (error) {
    console.error("Failed to leave event:", error);
  }
}

// ─── げんき確認 ──────────────────────────────────────────

export type WellnessStatus = "genki" | "sukoshi" | "tsurai";

export type WellnessCheck = {
  id: string;
  userId: string;
  status: WellnessStatus;
  checkedAt: string;
};

export async function getTodayWellness(
  userId: string
): Promise<WellnessCheck | null> {
  const today = new Date().toISOString().split("T")[0];
  const { data, error } = await supabase
    .from("wellness_checks")
    .select("*")
    .eq("user_id", userId)
    .eq("checked_at", today)
    .maybeSingle();

  if (error || !data) return null;

  return {
    id: data.id,
    userId: data.user_id,
    status: data.status as WellnessStatus,
    checkedAt: data.checked_at,
  };
}

export async function submitWellness(userId: string, status: WellnessStatus) {
  const today = new Date().toISOString().split("T")[0];
  const { error } = await supabase
    .from("wellness_checks")
    .upsert(
      { user_id: userId, status, checked_at: today },
      { onConflict: "user_id,checked_at" }
    );

  if (error) {
    console.error("Failed to submit wellness:", error);
  }
  return !error;
}

export async function fetchTodayWellnessSummary(): Promise<{
  total: number;
  genki: number;
  sukoshi: number;
  tsurai: number;
}> {
  const today = new Date().toISOString().split("T")[0];
  const { data } = await supabase
    .from("wellness_checks")
    .select("status")
    .eq("checked_at", today);

  const checks = data ?? [];
  return {
    total: checks.length,
    genki: checks.filter((c) => c.status === "genki").length,
    sukoshi: checks.filter((c) => c.status === "sukoshi").length,
    tsurai: checks.filter((c) => c.status === "tsurai").length,
  };
}
