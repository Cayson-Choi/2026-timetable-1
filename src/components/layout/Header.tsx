"use client";

import { CalendarDays, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useState } from "react";
import Link from "next/link";

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "schedule", label: "수업일정" },
  { id: "stats", label: "통계" },
];

export function Header({ activeTab, onTabChange }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-md shadow-blue-600/20">
              <CalendarDays className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                스마트전기과
              </h1>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 -mt-0.5">
                2026 수업일정 관리
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 dark:border-gray-800 mt-2 pt-3">
            <nav className="flex flex-col gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    onTabChange(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium text-left transition-colors ${
                    activeTab === tab.id
                      ? "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
