"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";

type ReadStatusContextType = {
  isRead: (circularId: string) => boolean;
  toggleRead: (circularId: string) => void;
  unreadCount: number;
  totalCount: number;
};

const ReadStatusContext = createContext<ReadStatusContextType | null>(null);

export function ReadStatusProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [totalCount, setTotalCount] = useState(0);

  // Supabaseから既読状態と回覧板総数を取得
  useEffect(() => {
    if (!user) return;

    async function load() {
      const [{ data: reads }, { count }] = await Promise.all([
        supabase
          .from("circular_reads")
          .select("circular_id")
          .eq("user_id", user!.id),
        supabase
          .from("circulars")
          .select("*", { count: "exact", head: true }),
      ]);

      if (reads) {
        setReadIds(new Set(reads.map((r) => r.circular_id)));
      }
      setTotalCount(count ?? 0);
    }
    load();
  }, [user]);

  const isRead = useCallback(
    (circularId: string) => readIds.has(circularId),
    [readIds]
  );

  const toggleRead = useCallback(
    (circularId: string) => {
      if (!user) return;

      setReadIds((prev) => {
        const next = new Set(prev);
        if (next.has(circularId)) {
          next.delete(circularId);
          supabase
            .from("circular_reads")
            .delete()
            .eq("circular_id", circularId)
            .eq("user_id", user.id)
            .then();
        } else {
          next.add(circularId);
          supabase
            .from("circular_reads")
            .insert({ circular_id: circularId, user_id: user.id })
            .then();
        }
        return next;
      });
    },
    [user]
  );

  const unreadCount = totalCount - readIds.size;

  return (
    <ReadStatusContext.Provider
      value={{ isRead, toggleRead, unreadCount, totalCount }}
    >
      {children}
    </ReadStatusContext.Provider>
  );
}

export function useReadStatus() {
  const context = useContext(ReadStatusContext);
  if (!context) {
    throw new Error("useReadStatus must be used within ReadStatusProvider");
  }
  return context;
}
