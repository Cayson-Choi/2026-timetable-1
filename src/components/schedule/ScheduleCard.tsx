"use client";

import { ScheduleEntry } from "@/lib/types";
import {
  formatPeriods,
  getDepartmentBgClass,
  getDepartmentBorderClass,
} from "@/lib/utils";
import { MapPin, Clock, User } from "lucide-react";

interface ScheduleCardProps {
  data: ScheduleEntry[];
}

export function ScheduleCard({ data }: ScheduleCardProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400 dark:text-gray-500">
        <p className="text-lg font-medium">검색 결과가 없습니다</p>
        <p className="text-sm mt-1">필터 조건을 변경해 보세요</p>
      </div>
    );
  }

  // Group by date
  const grouped = data.reduce((acc, entry) => {
    const key = `${entry.sortDate}|${entry.date}|${entry.day}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(entry);
    return acc;
  }, {} as Record<string, ScheduleEntry[]>);

  return (
    <div className="space-y-6">
      {Object.entries(grouped)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, entries]) => {
          const [, date, day] = key.split("|");
          return (
            <div key={key}>
              <div className="flex items-center gap-2 mb-3">
                <div
                  className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold ${
                    day === "월"
                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                      : day === "화"
                      ? "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300"
                      : day === "수"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                      : day === "목"
                      ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                      : day === "금"
                      ? "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  {day}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {date}
                </h3>
                <span className="text-sm text-gray-400">
                  ({entries.length}건)
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    className={`border-l-4 ${getDepartmentBorderClass(
                      entry.department
                    )} bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 hover:shadow-md transition-shadow`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">
                        {entry.subject}
                      </h4>
                      <span
                        className={`ml-2 shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${getDepartmentBgClass(
                          entry.department
                        )}`}
                      >
                        {entry.department}
                      </span>
                    </div>
                    <div className="space-y-1.5 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        <span>{entry.professor}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{formatPeriods(entry.periods)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{entry.classroom}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
    </div>
  );
}
