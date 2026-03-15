"use client";

import React, { useState, useMemo } from "react";
import { ScheduleEntry } from "@/lib/types";
import { getProfessorBgClass, getAllProfessorColors } from "@/lib/professorColors";
import { getDepartmentBgClass, isTodayByDate } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MonthlyCalendarProps {
  data: ScheduleEntry[];
}

const DAY_ORDER = ["월", "화", "수", "목", "금", "토"];

export function WeeklyCalendar({ data }: MonthlyCalendarProps) {
  // Derive available months from data
  const availableMonths = useMemo(() => {
    const months = new Set<number>();
    for (const d of data) {
      // sortDate format: "2026-03-14"
      const m = parseInt(d.sortDate.split("-")[1], 10);
      months.add(m);
    }
    return [...months].sort((a, b) => a - b);
  }, [data]);

  const [currentMonth, setCurrentMonth] = useState<number>(() => {
    // Default to current month if available, else first available
    const now = new Date();
    const thisMonth = now.getMonth() + 1;
    if (availableMonths.includes(thisMonth)) return thisMonth;
    return availableMonths[0] ?? 3;
  });

  const currentIdx = availableMonths.indexOf(currentMonth);
  const hasPrev = currentIdx > 0;
  const hasNext = currentIdx < availableMonths.length - 1;

  // Filter data for current month
  const monthData = useMemo(() => {
    return data.filter((d) => {
      const m = parseInt(d.sortDate.split("-")[1], 10);
      return m === currentMonth;
    });
  }, [data, currentMonth]);

  // Group by date (sortDate), sorted
  const dateGroups = useMemo(() => {
    const groups = new Map<string, { date: string; day: string; entries: ScheduleEntry[] }>();
    for (const entry of monthData) {
      if (!groups.has(entry.sortDate)) {
        groups.set(entry.sortDate, { date: entry.date, day: entry.day, entries: [] });
      }
      groups.get(entry.sortDate)!.entries.push(entry);
    }
    // Sort by sortDate
    const sorted = [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]));
    // Deduplicate entries and sort by period within each date
    for (const [, group] of sorted) {
      const seen = new Set<string>();
      group.entries = group.entries
        .filter((e) => {
          if (seen.has(e.id)) return false;
          seen.add(e.id);
          return true;
        })
        .sort((a, b) => Math.min(...a.periods) - Math.min(...b.periods));
    }
    return sorted;
  }, [monthData]);

  // Professors for legend
  const monthProfessors = useMemo(() => {
    const profs = [...new Set(monthData.map((d) => d.professor))].sort();
    const allColors = getAllProfessorColors();
    return allColors.filter((c) => profs.includes(c.name));
  }, [monthData]);

  // Group dates by week number for desktop grid view
  const weekGroups = useMemo(() => {
    const groups = new Map<number, typeof dateGroups>();
    for (const [sortDate, group] of dateGroups) {
      const entry = group.entries[0];
      if (!entry) continue;
      const week = entry.week;
      if (!groups.has(week)) groups.set(week, []);
      groups.get(week)!.push([sortDate, group]);
    }
    return [...groups.entries()].sort((a, b) => a[0] - b[0]);
  }, [dateGroups]);

  const MonthNav = () => (
    <div className="flex items-center justify-center gap-3 mb-4">
      <button
        onClick={() => hasPrev && setCurrentMonth(availableMonths[currentIdx - 1])}
        disabled={!hasPrev}
        className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all ${
          hasPrev
            ? "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            : "text-gray-300 dark:text-gray-600 cursor-not-allowed"
        }`}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <div className="text-center min-w-[140px]">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          {currentMonth}월 시간표
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">
          {currentIdx + 1} / {availableMonths.length}
        </p>
      </div>
      <button
        onClick={() => hasNext && setCurrentMonth(availableMonths[currentIdx + 1])}
        disabled={!hasNext}
        className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all ${
          hasNext
            ? "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            : "text-gray-300 dark:text-gray-600 cursor-not-allowed"
        }`}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );

  if (monthData.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400 dark:text-gray-500">
        <MonthNav />
        <p className="text-lg font-medium">해당 월에 수업이 없습니다</p>
        <p className="text-sm mt-1">← → 버튼으로 다른 월을 확인해 보세요</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
        {monthProfessors.map(({ name, color }) => (
          <div key={name} className="flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${color.dot}`} />
            <span className="text-[11px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">{name}</span>
          </div>
        ))}
      </div>

      <MonthNav />

      {/* Desktop: grouped by week */}
      <div className="hidden sm:block space-y-6">
        {weekGroups.map(([week, dates]) => (
          <div key={week}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-lg">
                {week}주차
              </span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {dates.map(([sortDate, { date, day, entries }]) => {
                const today = isTodayByDate(date);
                return (
                  <div
                    key={sortDate}
                    className={`rounded-xl border p-3 ${
                      today
                        ? "border-blue-300 dark:border-blue-600 bg-blue-50/50 dark:bg-blue-950/20"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <div className={`flex items-center gap-2 mb-2 px-1 ${
                      today ? "text-blue-700 dark:text-blue-300" : "text-gray-700 dark:text-gray-300"
                    }`}>
                      <span className="font-bold text-sm">{day}</span>
                      <span className="text-xs opacity-80">{date}</span>
                      {today && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500 text-white">
                          오늘
                        </span>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      {entries.map((entry) => (
                        <div
                          key={entry.id}
                          className={`rounded-lg p-2.5 text-xs leading-tight ${getProfessorBgClass(entry.professor)}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="font-semibold text-sm">{entry.subject}</div>
                              <div className="opacity-80 mt-0.5">{entry.professor} · {entry.classroom}</div>
                            </div>
                            <div className="flex flex-col items-end gap-1 shrink-0">
                              <span className="text-[11px] font-medium opacity-80">
                                {entry.periods.length === 1
                                  ? `${entry.periods[0]}교시`
                                  : `${Math.min(...entry.periods)}-${Math.max(...entry.periods)}교시`}
                              </span>
                              <span className={`px-1.5 py-0 rounded text-[9px] font-bold ${getDepartmentBgClass(entry.department)}`}>
                                {entry.department}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Mobile: day-by-day vertical list */}
      <div className="sm:hidden space-y-4">
        {dateGroups.map(([sortDate, { date, day, entries }]) => {
          const today = isTodayByDate(date);
          return (
            <div key={sortDate}>
              <div className={`flex items-center gap-2 mb-2 px-2 py-1.5 rounded-lg ${
                today ? "bg-blue-100 dark:bg-blue-900/30" : "bg-gray-100 dark:bg-gray-800"
              }`}>
                <span className={`font-bold text-sm ${today ? "text-blue-700 dark:text-blue-300" : "text-gray-700 dark:text-gray-300"}`}>
                  {day}
                </span>
                <span className={`text-xs ${today ? "text-blue-500 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}`}>
                  {date}
                </span>
                {today && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500 text-white">
                    오늘
                  </span>
                )}
              </div>
              <div className="space-y-1.5 pl-1">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    className={`rounded-lg p-2.5 text-xs leading-tight ${getProfessorBgClass(entry.professor)}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-semibold text-sm">{entry.subject}</div>
                        <div className="opacity-80 mt-0.5">{entry.professor} · {entry.classroom}</div>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-[11px] font-medium opacity-80">
                          {entry.periods.length === 1
                            ? `${entry.periods[0]}교시`
                            : `${Math.min(...entry.periods)}-${Math.max(...entry.periods)}교시`}
                        </span>
                        <span className={`px-1.5 py-0 rounded text-[9px] font-bold ${getDepartmentBgClass(entry.department)}`}>
                          {entry.department}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
