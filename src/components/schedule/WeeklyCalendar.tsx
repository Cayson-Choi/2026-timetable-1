"use client";

import React from "react";
import { ScheduleEntry } from "@/lib/types";
import { getDepartmentBgClass, formatPeriods } from "@/lib/utils";

interface WeeklyCalendarProps {
  data: ScheduleEntry[];
  week: number | null;
}

const DAYS = ["월", "화", "수", "목", "금"];
const PERIODS = [1, 2, 3, 4, 5, 6, 7, 8];

const DAY_COLORS: Record<string, string> = {
  "월": "bg-yellow-50 dark:bg-yellow-900/10",
  "화": "bg-pink-50 dark:bg-pink-900/10",
  "수": "bg-green-50 dark:bg-green-900/10",
  "목": "bg-purple-50 dark:bg-purple-900/10",
  "금": "bg-cyan-50 dark:bg-cyan-900/10",
};

export function WeeklyCalendar({ data, week }: WeeklyCalendarProps) {
  // If no week selected, show first available
  const targetWeek = week ?? (data.length > 0 ? data[0].week : 1);
  const weekData = data.filter((d) => d.week === targetWeek);

  // Build a map: day -> period -> entries
  const grid = new Map<string, Map<number, ScheduleEntry[]>>();
  for (const day of DAYS) {
    grid.set(day, new Map());
    for (const p of PERIODS) {
      grid.get(day)!.set(p, []);
    }
  }

  for (const entry of weekData) {
    for (const p of entry.periods) {
      const dayMap = grid.get(entry.day);
      if (dayMap && dayMap.has(p)) {
        dayMap.get(p)!.push(entry);
      }
    }
  }

  // Get dates for each day
  const dayDates = new Map<string, string>();
  for (const entry of weekData) {
    if (!dayDates.has(entry.day)) {
      dayDates.set(entry.day, entry.date);
    }
  }

  if (weekData.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400 dark:text-gray-500">
        <p className="text-lg font-medium">해당 주차에 수업이 없습니다</p>
        <p className="text-sm mt-1">다른 주차를 선택해 보세요</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[700px]">
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {targetWeek}주차 시간표
          </h3>
        </div>

        <div className="grid grid-cols-[60px_repeat(5,1fr)] border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-2" />
          {DAYS.map((day) => (
            <div
              key={day}
              className={`border-b border-l border-gray-200 dark:border-gray-700 p-2 text-center ${DAY_COLORS[day]}`}
            >
              <div className="font-bold text-gray-900 dark:text-white">{day}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {dayDates.get(day) || ""}
              </div>
            </div>
          ))}

          {/* Body */}
          {PERIODS.map((period) => (
            <React.Fragment key={`row-${period}`}>
              <div
                className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 p-2 text-center text-sm font-semibold text-gray-600 dark:text-gray-300 flex items-center justify-center"
              >
                {period}
              </div>
              {DAYS.map((day) => {
                const entries = grid.get(day)?.get(period) || [];
                // Deduplicate: show unique entries only (by id)
                const seen = new Set<string>();
                const unique = entries.filter((e) => {
                  if (seen.has(e.id)) return false;
                  seen.add(e.id);
                  return true;
                });

                return (
                  <div
                    key={`${day}-${period}`}
                    className="border-b border-l border-gray-200 dark:border-gray-700 p-1 min-h-[60px]"
                  >
                    {unique.map((entry) => (
                      <div
                        key={entry.id}
                        className={`rounded-md p-1.5 mb-1 text-[11px] leading-tight ${getDepartmentBgClass(
                          entry.department
                        )}`}
                        title={`${entry.subject} - ${entry.professor} (${entry.classroom})`}
                      >
                        <div className="font-semibold truncate">{entry.subject}</div>
                        <div className="opacity-75 truncate">{entry.professor}</div>
                        <div className="opacity-60 truncate">{entry.classroom}</div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
