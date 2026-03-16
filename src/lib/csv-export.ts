import { supabase } from "./supabase";

function downloadCsv(filename: string, csvContent: string) {
  const bom = "\uFEFF";
  const blob = new Blob([bom + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function exportCircularReads() {
  const { data: reads } = await supabase
    .from("circular_reads")
    .select("circular_id, user_id");

  const { data: circulars } = await supabase
    .from("circulars")
    .select("id, title");

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, name");

  if (!reads || !circulars || !profiles) return;

  const circularMap = new Map(circulars.map((c) => [c.id, c.title]));
  const profileMap = new Map(profiles.map((p) => [p.id, p.name]));

  const rows = reads.map((r) => ({
    回覧板: circularMap.get(r.circular_id) ?? r.circular_id,
    ユーザー: profileMap.get(r.user_id) ?? r.user_id,
  }));

  const header = "回覧板,ユーザー\n";
  const body = rows.map((r) => `"${r.回覧板}","${r.ユーザー}"`).join("\n");
  downloadCsv("circular_reads.csv", header + body);
}

export async function exportEventParticipants() {
  const { data: participations } = await supabase
    .from("event_participations")
    .select("event_id, user_id");

  const { data: events } = await supabase
    .from("events")
    .select("id, title, date");

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, name");

  if (!participations || !events || !profiles) return;

  const eventMap = new Map(events.map((e) => [e.id, { title: e.title, date: e.date }]));
  const profileMap = new Map(profiles.map((p) => [p.id, p.name]));

  const rows = participations.map((p) => {
    const event = eventMap.get(p.event_id);
    return {
      イベント: event?.title ?? p.event_id,
      開催日: event?.date ?? "",
      参加者: profileMap.get(p.user_id) ?? p.user_id,
    };
  });

  const header = "イベント,開催日,参加者\n";
  const body = rows
    .map((r) => `"${r.イベント}","${r.開催日}","${r.参加者}"`)
    .join("\n");
  downloadCsv("event_participants.csv", header + body);
}
