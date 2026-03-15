"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { fetchEvents, joinEvent, leaveEvent } from "@/lib/queries";
import { supabase } from "@/lib/supabase";
import { formatDate, formatTime } from "@/lib/utils";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import type { Event } from "@/types";

export default function EventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [joinedIds, setJoinedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchEvents().then((data) => {
      setEvents(data);
      setLoading(false);
    });
  }, []);

  // 自分の参加状況を取得
  useEffect(() => {
    if (!user) return;
    supabase
      .from("event_participations")
      .select("event_id")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (data) {
          setJoinedIds(new Set(data.map((d) => d.event_id)));
        }
      });
  }, [user]);

  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const handleJoin = useCallback(
    async (eventId: string) => {
      if (!user) return;
      const isJoined = joinedIds.has(eventId);

      // 楽観的UI更新
      setJoinedIds((prev) => {
        const next = new Set(prev);
        if (isJoined) {
          next.delete(eventId);
        } else {
          next.add(eventId);
        }
        return next;
      });
      setEvents((prev) =>
        prev.map((e) =>
          e.id === eventId
            ? {
                ...e,
                currentParticipants:
                  e.currentParticipants + (isJoined ? -1 : 1),
              }
            : e
        )
      );

      // DB更新
      if (isJoined) {
        await leaveEvent(eventId, user.id);
      } else {
        await joinEvent(eventId, user.id);
      }
    },
    [user, joinedIds]
  );

  return (
    <div className="max-w-lg mx-auto px-4 py-4">
      <h1 className="text-2xl font-bold mb-4">イベント一覧</h1>

      {loading && (
        <p className="text-center text-gray-500 text-lg py-12">
          読み込み中...
        </p>
      )}

      <div className="flex flex-col gap-4">
        {sortedEvents.map((event) => {
          const isJoined = joinedIds.has(event.id);
          const isFull =
            event.maxParticipants !== undefined &&
            event.currentParticipants >= event.maxParticipants;

          return (
            <Card key={event.id}>
              <CardHeader className="flex items-center justify-between gap-2">
                <Badge variant={event.category} size="sm">
                  {event.category}
                </Badge>
                <time className="text-sm text-gray-500 shrink-0">
                  {formatDate(event.date)}
                </time>
              </CardHeader>

              <CardBody>
                <h2 className="text-xl font-bold leading-snug mb-2">
                  <Link
                    href={`/events/${event.id}`}
                    className="text-gray-900 hover:text-pink-700 hover:underline"
                  >
                    {event.title}
                  </Link>
                </h2>

                <div className="flex flex-col gap-1.5 text-base text-gray-700 mb-3">
                  <p className="flex items-start gap-2">
                    <span className="shrink-0" aria-hidden="true">
                      🕐
                    </span>
                    <span>
                      {formatTime(event.startTime)} 〜{" "}
                      {formatTime(event.endTime)}
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="shrink-0" aria-hidden="true">
                      📍
                    </span>
                    <span>{event.location}</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="shrink-0" aria-hidden="true">
                      👤
                    </span>
                    <span>{event.organizer}</span>
                  </p>
                </div>

                <p className="text-base text-gray-600 line-clamp-2 leading-relaxed">
                  {event.description}
                </p>

                {event.maxParticipants !== undefined && (
                  <div className="mt-3 text-base font-medium">
                    <span
                      className={isFull ? "text-red-600" : "text-gray-700"}
                    >
                      参加者 {event.currentParticipants} /{" "}
                      {event.maxParticipants} 人
                    </span>
                    {isFull && !isJoined && (
                      <span className="ml-2 text-red-600 text-sm">
                        （定員に達しました）
                      </span>
                    )}
                  </div>
                )}
              </CardBody>

              <CardFooter>
                <Button
                  size="lg"
                  fullWidth
                  variant={isJoined ? "secondary" : "primary"}
                  disabled={isFull && !isJoined}
                  onClick={() => handleJoin(event.id)}
                >
                  {isJoined ? "参加を取り消す" : "参加する"}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
