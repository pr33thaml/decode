"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Code2, Sparkles } from "lucide-react";

const links = [
  { href: "/app", label: "Analyze" },
  { href: "/pricing", label: "Pricing" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15 text-accent">
            <Code2 className="h-4 w-4" />
          </span>
          Decode
        </Link>

        <nav className="flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                pathname === link.href
                  ? "bg-surface-2 text-foreground"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/app"
            className="ml-2 flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Try free
          </Link>
        </nav>
      </div>
    </header>
  );
}
