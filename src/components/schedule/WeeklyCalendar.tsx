"use client";

import React, { useMemo } from "react";
import { ScheduleEntry } from "@/lib/types";
import { getProfessorBgClass, getAllProfessorColors } from "@/lib/professorColors";
import { getDepartmentBgClass, isTodayByDate } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface WeeklyCalendarProps {
  data: ScheduleEntry[];
  week: number | null;
  availableWeeks: number[];
  onWeekChange: (week: number) => void;
}

const WEEKDAYS = ["월", "화", "수", "목", "금"];
const WEEKDAYS_WITH_SAT = ["월", "화", "수", "목", "금", "토"];
const PERIODS_8 = [1, 2, 3, 4, 5, 6, 7, 8];
const PERIODS_9 = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const DAY_COLORS: Record<string, { header: string; text: string }> = {
  "월": { header: "bg-gray-100 dark:bg-gray-800", text: "text-gray-700 dark:text-gray-300" },
  "화": { header: "bg-gray-100 dark:bg-gray-800", text: "text-gray-700 dark:text-gray-300" },
  "수": { header: "bg-gray-100 dark:bg-gray-800", text: "text-gray-700 dark:text-gray-300" },
  "목": { header: "bg-gray-100 dark:bg-gray-800", text: "text-gray-700 dark:text-gray-300" },
  "금": { header: "bg-gray-100 dark:bg-gray-800", text: "text-gray-700 dark:text-gray-300" },
  "토": { header: "bg-gray-100 dark:bg-gray-800", text: "text-gray-700 dark:text-gray-300" },
};

export function WeeklyCalendar({ data, week, availableWeeks, onWeekChange }: WeeklyCalendarProps) {
  const sortedWeeks = useMemo(() => [...availableWeeks].sort((a, b) => a - b), [availableWeeks]);
  const targetWeek = week ?? (sortedWeeks.length > 0 ? sortedWeeks[0] : 1);
  const currentIdx = sortedWeeks.indexOf(targetWeek);
  const hasPrev = currentIdx > 0;
  const hasNext = currentIdx < sortedWeeks.length - 1;
  const weekData = data.filter((d) => d.week === targetWeek);

  const hasSaturday = weekData.some((d) => d.day === "토");
  const hasPeriod9 = weekData.some((d) => d.periods.includes(9));

  const DAYS = hasSaturday ? WEEKDAYS_WITH_SAT : WEEKDAYS;
  const PERIODS = hasPeriod9 ? PERIODS_9 : PERIODS_8;
  const gridCols = hasSaturday
    ? "grid-cols-[60px_repeat(6,1fr)]"
    : "grid-cols-[60px_repeat(5,1fr)]";

  // Build grid
  const grid = useMemo(() => {
    const g = new Map<string, Map<number, ScheduleEntry[]>>();
    for (const day of DAYS) {
      g.set(day, new Map());
      for (const p of PERIODS) {
        g.get(day)!.set(p, []);
      }
    }
    for (const entry of weekData) {
      for (const p of entry.periods) {
        const dayMap = g.get(entry.day);
        if (dayMap && dayMap.has(p)) {
          dayMap.get(p)!.push(entry);
        }
      }
    }
    return g;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekData.length, targetWeek, hasSaturday, hasPeriod9]);

  // Get professors appearing this week (for legend)
  const weekProfessors = useMemo(() => {
    const profs = [...new Set(weekData.map((d) => d.professor))].sort();
    const allColors = getAllProfessorColors();
    return allColors.filter((c) => profs.includes(c.name));
  }, [weekData]);

  // Get dates for each day
  const dayDates = new Map<string, string>();
  for (const entry of weekData) {
    if (!dayDates.has(entry.day)) {
      dayDates.set(entry.day, entry.date);
    }
  }

  // Build mobile day groups: day -> unique entries sorted by first period
  const mobileGroups = useMemo(() => {
    const groups = new Map<string, ScheduleEntry[]>();
    for (const day of DAYS) {
      const dayEntries = weekData.filter((e) => e.day === day);
      const seen = new Set<string>();
      const unique = dayEntries.filter((e) => {
        if (seen.has(e.id)) return false;
        seen.add(e.id);
        return true;
      });
      unique.sort((a, b) => Math.min(...a.periods) - Math.min(...b.periods));
      if (unique.length > 0) groups.set(day, unique);
    }
    return groups;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekData.length, targetWeek]);

  // Week navigation component
  const WeekNav = () => (
    <div className="flex items-center justify-center gap-3 mb-4">
      <button
        onClick={() => hasPrev && onWeekChange(sortedWeeks[currentIdx - 1])}
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
          {targetWeek}주차 시간표
        </h3>
        {hasSaturday && (
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium">
            P-TECH 토요일 수업 포함
          </p>
        )}
        <p className="text-xs text-gray-400 mt-0.5">
          {currentIdx + 1} / {sortedWeeks.length}
        </p>
      </div>
      <button
        onClick={() => hasNext && onWeekChange(sortedWeeks[currentIdx + 1])}
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

  if (weekData.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400 dark:text-gray-500">
        <WeekNav />
        <p className="text-lg font-medium">해당 주차에 수업이 없습니다</p>
        <p className="text-sm mt-1">← → 버튼으로 다른 주차를 확인해 보세요</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Legend - 교수별 색상 안내 */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
        {weekProfessors.map(({ name, color }) => (
          <div key={name} className="flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${color.dot}`} />
            <span className="text-[11px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">{name}</span>
          </div>
        ))}
      </div>

      {/* Desktop: Grid calendar */}
      <div className="hidden sm:block overflow-x-auto">
        <div className={hasSaturday ? "min-w-[840px]" : "min-w-[700px]"}>
          <WeekNav />

          <div
            className={`grid ${gridCols} border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden`}
          >
            {/* Header */}
            <div className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-2" />
            {DAYS.map((day) => {
              const dayColor = DAY_COLORS[day];
              const dayDate = dayDates.get(day) || "";
              const today = dayDate ? isTodayByDate(dayDate) : false;
              return (
                <div
                  key={day}
                  className={`border-b border-l border-gray-200 dark:border-gray-700 p-2 text-center ${
                    today ? "bg-blue-100 dark:bg-blue-900/30" : dayColor.header
                  }`}
                >
                  <div className={`font-bold ${today ? "text-blue-700 dark:text-blue-300" : dayColor.text}`}>
                    {day}
                    {today && (
                      <span className="ml-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500 text-white align-middle">
                        오늘
                      </span>
                    )}
                  </div>
                  <div className={`text-xs ${today ? "text-blue-500 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}`}>
                    {dayDate}
                  </div>
                </div>
              );
            })}

            {/* Body */}
            {PERIODS.map((period) => (
              <React.Fragment key={`row-${period}`}>
                <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 p-2 text-center text-sm font-semibold text-gray-600 dark:text-gray-300 flex items-center justify-center">
                  {period}
                </div>
                {DAYS.map((day) => {
                  const entries = grid.get(day)?.get(period) || [];
                  const seen = new Set<string>();
                  const unique = entries.filter((e) => {
                    if (seen.has(e.id)) return false;
                    seen.add(e.id);
                    return true;
                  });
                  const dayDate = dayDates.get(day) || "";
                  const todayCol = dayDate ? isTodayByDate(dayDate) : false;

                  return (
                    <div
                      key={`${day}-${period}`}
                      className={`border-b border-l border-gray-200 dark:border-gray-700 p-1 min-h-[60px] ${
                        todayCol ? "bg-blue-50/50 dark:bg-blue-950/20" : ""
                      }`}
                    >
                      {unique.map((entry) => (
                        <div
                          key={entry.id}
                          className={`rounded-md p-1.5 mb-1 text-[11px] leading-tight ${getProfessorBgClass(
                            entry.professor
                          )}`}
                          title={`${entry.subject} - ${entry.professor} (${entry.classroom}) [${entry.department}]`}
                        >
                          <div className="font-semibold truncate">{entry.subject}</div>
                          <div className="opacity-80 truncate">{entry.professor}</div>
                          <div className="opacity-60 truncate">{entry.classroom}</div>
                          <span className={`inline-block mt-0.5 px-1.5 py-0 rounded text-[9px] font-bold ${getDepartmentBgClass(entry.department)}`}>
                            {entry.department}
                          </span>
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

      {/* Mobile: Day-by-day vertical list */}
      <div className="sm:hidden">
        <WeekNav />
        <div className="space-y-4">
          {DAYS.map((day) => {
            const entries = mobileGroups.get(day);
            if (!entries) return null;
            const dayDate = dayDates.get(day) || "";
            const today = dayDate ? isTodayByDate(dayDate) : false;

            return (
              <div key={day}>
                {/* Day header */}
                <div className={`flex items-center gap-2 mb-2 px-2 py-1.5 rounded-lg ${
                  today ? "bg-blue-100 dark:bg-blue-900/30" : "bg-gray-100 dark:bg-gray-800"
                }`}>
                  <span className={`font-bold text-sm ${today ? "text-blue-700 dark:text-blue-300" : "text-gray-700 dark:text-gray-300"}`}>
                    {day}
                  </span>
                  <span className={`text-xs ${today ? "text-blue-500 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}`}>
                    {dayDate}
                  </span>
                  {today && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500 text-white">
                      오늘
                    </span>
                  )}
                </div>
                {/* Entries */}
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
    </div>
  );
}
