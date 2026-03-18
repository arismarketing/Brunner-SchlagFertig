"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  ClipboardList,
  Settings,
  Axe,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/abrechnungen", label: "Abrechnungen", icon: FileText },
  { href: "/bauern", label: "Bauern", icon: Users },
  { href: "/durchschlagsblock", label: "Durchschlagsblock", icon: ClipboardList },
  { href: "/einstellungen", label: "Einstellungen", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Schließe Sidebar bei Navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile Hamburger-Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden bg-[hsl(140,45%,22%)] text-white p-2 rounded-lg shadow-lg"
        aria-label="Menü öffnen"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Overlay für Mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-60 bg-[hsl(140,45%,22%)] text-white flex flex-col z-50 transition-transform duration-200 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Logo / Branding */}
        <div className="px-5 py-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Axe className="h-7 w-7 text-green-300" />
              <div>
                <h1 className="text-xl font-bold tracking-tight">SchlagFertig</h1>
                <p className="text-xs text-green-200/70 mt-0.5">Brunner Forstservice</p>
              </div>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden text-white/70 hover:text-white"
              aria-label="Menü schließen"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-white/15 text-white"
                    : "text-green-100/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/10 text-xs text-green-200/50">
          SchlagFertig v0.1 — Prototyp
        </div>
      </aside>
    </>
  );
}
