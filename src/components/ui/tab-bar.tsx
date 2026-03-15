"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type UserRole = "resident" | "officer" | "admin";

type TabItem = {
  label: string;
  href: string;
  icon: string;
  requireRole?: UserRole[];
};

const tabs: TabItem[] = [
  { label: "回覧板", href: "/", icon: "\uD83D\uDCCB" },
  { label: "イベント", href: "/events", icon: "\uD83D\uDCC5" },
  { label: "お知らせ", href: "/notices", icon: "\uD83D\uDD14" },
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

          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                className={[
                  "flex flex-col items-center justify-center gap-0.5",
                  "min-h-[56px] px-1 py-2 text-center no-underline transition-colors duration-150",
                  "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-pink-600",
                  isActive
                    ? "text-pink-700 font-bold"
                    : "text-gray-500 hover:text-gray-900",
                ].join(" ")}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="text-2xl leading-none" aria-hidden="true">
                  {tab.icon}
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
