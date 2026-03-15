"use client";

import { useAuth } from "@/lib/auth-context";

type HeaderProps = {
  userName?: string;
};

export function Header({ userName }: HeaderProps) {
  const { signOut } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-[#EC6D80] text-white shadow-md">
      <div className="flex items-center justify-between max-w-lg mx-auto px-4 py-3 min-h-[56px]">
        <h1 className="text-xl font-bold tracking-wide m-0">
          なでしこつながり
        </h1>
        <div className="flex items-center gap-3 shrink-0 ml-3">
          {userName && (
            <span className="text-sm opacity-90">{userName}</span>
          )}
          <button
            onClick={signOut}
            className="text-xs bg-white/20 hover:bg-white/30 rounded-full px-3 py-1 transition-colors cursor-pointer"
          >
            ログアウト
          </button>
        </div>
      </div>
    </header>
  );
}
