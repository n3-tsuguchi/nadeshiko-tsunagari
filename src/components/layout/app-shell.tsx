"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { BottomTabBar } from "@/components/ui/tab-bar";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";

type UserRole = "resident" | "officer" | "admin";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [userRole, setUserRole] = useState<UserRole>("resident");

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data?.role) {
          setUserRole(data.role as UserRole);
        }
      });
  }, [user]);

  // ログインページではヘッダー・タブバーを非表示
  if (pathname.startsWith("/login")) {
    return <>{children}</>;
  }

  // 認証読み込み中
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-500">読み込み中...</p>
      </div>
    );
  }

  const displayName =
    user?.user_metadata?.name || user?.email?.split("@")[0] || "ゲスト";

  return (
    <>
      <Header userName={displayName} />
      <main className="pb-20">{children}</main>
      <BottomTabBar userRole={userRole} />
    </>
  );
}
