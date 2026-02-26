"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="w-9 h-9" />;
  }

  const options = [
    { value: "light", icon: Sun, label: "라이트" },
    { value: "dark", icon: Moon, label: "다크" },
    { value: "system", icon: Monitor, label: "시스템" },
  ] as const;

  return (
    <div className="flex items-center gap-1 rounded-lg bg-gray-100 dark:bg-gray-800 p-1">
      {options.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`p-1.5 rounded-md transition-all duration-200 ${
            theme === value
              ? "bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400"
              : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
          title={label}
        >
          <Icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
}
