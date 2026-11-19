"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Brand";
import { MemberGate } from "@/components/MemberGate";

const NAV = [
  { href: "/app", label: "Today", icon: "M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" },
  { href: "/app/program", label: "Program", icon: "M4 5h16M4 12h16M4 19h10" },
  { href: "/app/macros", label: "Macros", icon: "M5 20V10M12 20V4M19 20v-7" },
  { href: "/app/library", label: "Library", icon: "M5 4h10a4 4 0 0 1 4 4v12H9a4 4 0 0 1-4-4z M5 16a4 4 0 0 1 4-4h10" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();

  return (
    <div className="app">
      <header className="app-top">
        <div className="wrap row between">
          <Logo href="/app" />
          <nav className="top-nav" aria-label="Main">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className={isActive(path, n.href) ? "active" : ""}>
                {n.label}
              </Link>
            ))}
            <Link href="/app/settings" className={path === "/app/settings" ? "active" : ""}>
              Settings
            </Link>
          </nav>
          <Link href="/app/settings" className="settings-link" aria-label="Settings">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
            </svg>
          </Link>
        </div>
      </header>
      <main className="app-main">
        <MemberGate needProfile>{children}</MemberGate>
      </main>
      <nav className="tabbar" aria-label="Main">
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} className={isActive(path, n.href) ? "active" : ""}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round">
              <path d={n.icon} />
            </svg>
            <span>{n.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}

function isActive(path: string, href: string) {
  if (href === "/app") return path === "/app" || path.startsWith("/app/session");
  return path.startsWith(href);
}
