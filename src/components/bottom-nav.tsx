"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { changelog } from "@/data/changelog";
import { game } from "@/data/game";
import { isCategoryNew } from "@/lib/seen";
import { useSeen } from "@/lib/seen-store";
import { useI18n } from "@/i18n/locale-context";

const icons = {
  home: <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
  checklist: (
    <path d="M9 6h11M9 12h11M9 18h11M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2" />
  ),
  guides: <path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 21V5M8 7h7" />,
  contribute: <path d="M12 5v14M5 12h14" />,
};

export function BottomNav() {
  const pathname = usePathname();
  const seen = useSeen();
  const { t, p } = useI18n();
  const tabs = [
    {
      key: "home",
      href: p.home,
      label: t("Accueil", "Home"),
      icon: icons.home,
    },
    {
      key: "checklist",
      href: p.checklist,
      label: "Checklist",
      icon: icons.checklist,
    },
    { key: "guides", href: p.guides, label: "Guides", icon: icons.guides },
    {
      key: "contribute",
      href: p.contribute,
      label: t("Contribuer", "Contribute"),
      icon: icons.contribute,
    },
  ];
  const checklistFresh =
    seen !== null &&
    game.categories.some((c) => isCategoryNew(seen, c.id, changelog));
  return (
    <nav
      aria-label={t("Navigation principale", "Main navigation")}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-ligne/60 bg-surface-2/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-md"
    >
      <ul className="mx-auto grid h-[72px] max-w-xl grid-cols-4">
        {tabs.map((tab) => {
          const active =
            tab.key === "home"
              ? pathname === tab.href
              : pathname.startsWith(tab.href);
          return (
            <li key={tab.key}>
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={`flex h-full flex-col items-center justify-center gap-1 border-t-[3px] text-[13px] ${
                  active
                    ? "border-rose font-semibold text-sable"
                    : "border-transparent text-brume"
                }`}
              >
                <span className="relative">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    {tab.icon}
                  </svg>
                  {tab.key === "checklist" && checklistFresh && (
                    <span
                      className="absolute -right-1.5 -top-1 size-2.5 rounded-full bg-rose ring-2 ring-surface-2"
                      aria-hidden="true"
                    />
                  )}
                </span>
                {tab.label}
                {tab.key === "checklist" && checklistFresh && (
                  <span className="sr-only"> {t("(nouveautés)", "(new)")}</span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
