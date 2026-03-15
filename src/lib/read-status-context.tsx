"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { mockCirculars } from "@/lib/mock-data";

const CURRENT_USER_ID = "user-1";

type ReadStatusContextType = {
  isRead: (circularId: string) => boolean;
  toggleRead: (circularId: string) => void;
  unreadCount: number;
};

const ReadStatusContext = createContext<ReadStatusContextType | null>(null);

export function ReadStatusProvider({ children }: { children: ReactNode }) {
  // モックデータの既読状態を初期値としてSetで管理
  const [readIds, setReadIds] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    for (const c of mockCirculars) {
      if (c.readBy.includes(CURRENT_USER_ID)) {
        initial.add(c.id);
      }
    }
    return initial;
  });

  const isRead = useCallback(
    (circularId: string) => readIds.has(circularId),
    [readIds]
  );

  const toggleRead = useCallback((circularId: string) => {
    setReadIds((prev) => {
      const next = new Set(prev);
      if (next.has(circularId)) {
        next.delete(circularId);
      } else {
        next.add(circularId);
      }
      return next;
    });
  }, []);

  const unreadCount = mockCirculars.length - readIds.size;

  return (
    <ReadStatusContext.Provider value={{ isRead, toggleRead, unreadCount }}>
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
