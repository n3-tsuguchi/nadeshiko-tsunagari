"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useReadStatus } from "@/lib/read-status-context";

type UserRole = "resident" | "officer" | "admin";

type TabItem = {
  label: string;
  href: string;
  icon: string;
  requireRole?: UserRole[];
  showBadge?: "unread";
};

const tabs: TabItem[] = [
  { label: "回覧板", href: "/", icon: "\uD83D\uDCCB" },
  { label: "イベント", href: "/events", icon: "\uD83D\uDCC5" },
  { label: "お知らせ", href: "/notices", icon: "\uD83D\uDD14", showBadge: "unread" },
  {
    label: "管理",
    href: "/admin",
    icon: "\u2699\uFE0F",
    requireRole: ["officer", "admin"],
  },
];

type BottomTabBarProps = {
  userRole?: UserRole;
};

export function BottomTabBar({ userRole = "resident" }: BottomTabBarProps) {
  const pathname = usePathname();
  const { unreadCount } = useReadStatus();

  const visibleTabs = tabs.filter(
    (tab) => !tab.requireRole || tab.requireRole.includes(userRole)
  );

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-area-pb"
      role="navigation"
      aria-label="メインナビゲーション"
    >
      <ul className="flex items-stretch justify-around max-w-lg mx-auto list-none m-0 p-0">
        {visibleTabs.map((tab) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : pathname === tab.href || pathname.startsWith(tab.href + "/");

          const badgeCount = tab.showBadge === "unread" ? unreadCount : 0;

          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                className={[
                  "flex flex-col items-center justify-center gap-0.5 relative",
                  "min-h-[56px] px-1 py-2 text-center no-underline transition-colors duration-150",
                  "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-pink-600",
                  isActive
                    ? "text-pink-700 font-bold"
                    : "text-gray-500 hover:text-gray-900",
                ].join(" ")}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="relative text-2xl leading-none" aria-hidden="true">
                  {tab.icon}
                  {badgeCount > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1">
                      {badgeCount}
                    </span>
                  )}
                </span>
                <span className="text-xs font-medium">{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
