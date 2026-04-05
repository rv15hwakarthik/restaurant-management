"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRestaurant } from "@/components/restaurant-context";

const nav = [
  {
    href: "/app/orders",
    label: "Orders",
    icon: OrdersIcon,
  },
  {
    href: "/app/create-order",
    label: "New",
    icon: PlusOrderIcon,
  },
  {
    href: "/app/menu",
    label: "Menu",
    icon: MenuIcon,
  },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { restaurantName } = useRestaurant();

  return (
    <div className="flex h-dvh flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <header className="shrink-0 border-b border-zinc-200/80 bg-white/90 px-4 py-3 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/90">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-2">
          <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
            {restaurantName}
          </p>
          {/* <Link
            href="/auth/signout"
            className="shrink-0 text-xs font-medium text-zinc-500 underline dark:text-zinc-400"
          >
            Sign out
          </Link> */}
        </div>
      </header>
      <main className="flex min-h-0 flex-1 flex-col pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))]">
        {children}
      </main>
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-200/80 bg-white/95 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/95"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        aria-label="Main"
      >
        <ul className="mx-auto flex max-w-lg items-stretch justify-around px-2 pt-1">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <li key={href} className="flex-1">
                <Link
                  href={href}
                  prefetch
                  className="flex min-h-12 min-w-[3rem] flex-col items-center justify-center gap-0.5 rounded-xl py-2 text-xs font-medium outline-none ring-zinc-400 focus-visible:ring-2 dark:ring-zinc-500"
                  aria-current={active ? "page" : undefined}
                >
                  <span
                    className={
                      active
                        ? "text-zinc-900 dark:text-white"
                        : "text-zinc-500 dark:text-zinc-400"
                    }
                  >
                    <Icon active={active} />
                  </span>
                  <span
                    className={
                      active
                        ? "text-zinc-900 dark:text-white"
                        : "text-zinc-500 dark:text-zinc-400"
                    }
                  >
                    {label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

function PlusOrderIcon({ active }: { active: boolean }) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={active ? 2.25 : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx={12} cy={12} r={9} />
      <path d="M12 8v8M8 12h8" />
    </svg>
  );
}

function MenuIcon({ active }: { active: boolean }) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={active ? 2.25 : 2}
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M4 6h16M4 12h16M4 18h7" />
    </svg>
  );
}

function OrdersIcon({ active }: { active: boolean }) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={active ? 2.25 : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x={3} y={4} width={18} height={16} rx={2} />
      <path d="M7 8h4M7 12h10" />
    </svg>
  );
}
