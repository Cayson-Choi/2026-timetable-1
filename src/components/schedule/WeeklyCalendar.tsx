"use client";

import React, { useState, useMemo } from "react";
import { ScheduleEntry } from "@/lib/types";
import { getProfessorBgClass, getAllProfessorColors } from "@/lib/professorColors";
import { getDepartmentBgClass } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MonthlyCalendarProps {
  data: ScheduleEntry[];
}

const DAY_HEADERS = ["일", "월", "화", "수", "목", "금", "토"];

function getCalendarGrid(year: number, month: number): (number | null)[][] {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const daysInMonth = lastDay.getDate();
  // Sunday-start: Sun=0, Mon=1 ... Sat=6
  const startDow = firstDay.getDay();

  const grid: (number | null)[][] = [];
  let week: (number | null)[] = [];
  for (let i = 0; i < startDow; i++) week.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    week.push(d);
    if (week.length === 7) {
      grid.push(week);
      week = [];
    }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    grid.push(week);
  }
  return grid;
}

export function WeeklyCalendar({ data }: MonthlyCalendarProps) {
  const year = 2026;

  const availableMonths = useMemo(() => {
    const months = new Set<number>();
    for (const d of data) {
      months.add(parseInt(d.sortDate.split("-")[1], 10));
    }
    return [...months].sort((a, b) => a - b);
  }, [data]);

  const [currentMonth, setCurrentMonth] = useState<number>(() => {
    const now = new Date();
    const thisMonth = now.getMonth() + 1;
    if (availableMonths.includes(thisMonth)) return thisMonth;
    return availableMonths[0] ?? 3;
  });

  // Mobile: selected date for detail view
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const currentIdx = availableMonths.indexOf(currentMonth);
  const hasPrev = currentIdx > 0;
  const hasNext = currentIdx < availableMonths.length - 1;

  const calendarGrid = useMemo(() => getCalendarGrid(year, currentMonth), [currentMonth]);

  // Map day number -> entries
  const dateMap = useMemo(() => {
    const map = new Map<number, ScheduleEntry[]>();
    for (const entry of data) {
      const m = parseInt(entry.sortDate.split("-")[1], 10);
      const d = parseInt(entry.sortDate.split("-")[2], 10);
      if (m !== currentMonth) continue;
      if (!map.has(d)) map.set(d, []);
      map.get(d)!.push(entry);
    }
    // Deduplicate and sort
    for (const [day, entries] of map) {
      const seen = new Set<string>();
      map.set(
        day,
        entries
          .filter((e) => {
            if (seen.has(e.id)) return false;
            seen.add(e.id);
            return true;
          })
          .sort((a, b) => Math.min(...a.periods) - Math.min(...b.periods))
      );
    }
    return map;
  }, [data, currentMonth]);

  // Professors for legend
  const monthData = useMemo(
    () => data.filter((d) => parseInt(d.sortDate.split("-")[1], 10) === currentMonth),
    [data, currentMonth]
  );
  const monthProfessors = useMemo(() => {
    const profs = [...new Set(monthData.map((d) => d.professor))].sort();
    return getAllProfessorColors().filter((c) => profs.includes(c.name));
  }, [monthData]);

  const todayStr = useMemo(() => {
    const now = new Date();
    return `${now.getMonth() + 1}/${now.getDate()}`;
  }, []);

  const isToday = (day: number) => `${currentMonth}/${day}` === todayStr;

  // Selected date entries for mobile detail
  const selectedEntries = selectedDate ? dateMap.get(selectedDate) ?? [] : [];

  const handlePrev = () => {
    if (hasPrev) {
      setCurrentMonth(availableMonths[currentIdx - 1]);
      setSelectedDate(null);
    }
  };
  const handleNext = () => {
    if (hasNext) {
      setCurrentMonth(availableMonths[currentIdx + 1]);
      setSelectedDate(null);
    }
  };

  if (availableMonths.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400 dark:text-gray-500">
        <p className="text-lg font-medium">수업 데이터가 없습니다</p>
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

      {/* Month Navigation */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={handlePrev}
          disabled={!hasPrev}
          className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all ${
            hasPrev
              ? "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              : "text-gray-300 dark:text-gray-600 cursor-not-allowed"
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="text-center min-w-[120px]">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {year}년 {currentMonth}월
          </h3>
        </div>
        <button
          onClick={handleNext}
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

      {/* ===== Desktop Calendar ===== */}
      <div className="hidden sm:block">
        <div className="grid grid-cols-7 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
          {/* Day headers */}
          {DAY_HEADERS.map((day) => (
            <div
              key={day}
              className={`text-center text-sm font-bold py-2 border-b border-gray-200 dark:border-gray-700 ${
                day === "토"
                  ? "text-blue-500 bg-gray-50 dark:bg-gray-800"
                  : day === "일"
                  ? "text-red-500 bg-gray-50 dark:bg-gray-800"
                  : "text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800"
              }`}
            >
              {day}
            </div>
          ))}

          {/* Date cells */}
          {calendarGrid.map((week, wi) =>
            week.map((day, di) => {
              const entries = day ? dateMap.get(day) ?? [] : [];
              const today = day ? isToday(day) : false;
              const isSun = di === 0;
              const isSat = di === 6;

              return (
                <div
                  key={`${wi}-${di}`}
                  className={`min-h-[100px] border-b border-r border-gray-200 dark:border-gray-700 p-1.5 ${
                    day === null
                      ? "bg-gray-50/50 dark:bg-gray-800/30"
                      : today
                      ? "bg-blue-50 dark:bg-blue-950/20"
                      : ""
                  }`}
                >
                  {day !== null && (
                    <>
                      <div className={`text-xs font-bold mb-1 ${
                        today
                          ? "text-blue-600 dark:text-blue-400"
                          : isSat
                          ? "text-blue-500"
                          : isSun
                          ? "text-red-500"
                          : "text-gray-600 dark:text-gray-400"
                      }`}>
                        {day}
                        {today && (
                          <span className="ml-1 px-1 py-0.5 rounded text-[8px] font-bold bg-blue-500 text-white align-middle">
                            오늘
                          </span>
                        )}
                      </div>
                      <div className="space-y-0.5">
                        {entries.map((entry) => (
                          <div
                            key={entry.id}
                            className={`rounded px-1.5 py-1 text-[10px] leading-tight cursor-default ${getProfessorBgClass(entry.professor)}`}
                            title={`${entry.subject} - ${entry.professor} (${entry.classroom}) [${entry.department}] ${Math.min(...entry.periods)}-${Math.max(...entry.periods)}교시`}
                          >
                            <div className="font-semibold truncate">{entry.subject}</div>
                            <div className="opacity-75 truncate">{entry.professor} · {entry.periods.length === 1 ? `${entry.periods[0]}교시` : `${Math.min(...entry.periods)}-${Math.max(...entry.periods)}교시`}</div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ===== Mobile Calendar ===== */}
      <div className="sm:hidden">
        {/* Mini calendar grid */}
        <div className="grid grid-cols-7 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
          {/* Day headers */}
          {DAY_HEADERS.map((day) => (
            <div
              key={day}
              className={`text-center text-[11px] font-bold py-1.5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 ${
                day === "토" ? "text-blue-500" : day === "일" ? "text-red-500" : "text-gray-600 dark:text-gray-400"
              }`}
            >
              {day}
            </div>
          ))}

          {/* Date cells */}
          {calendarGrid.map((week, wi) =>
            week.map((day, di) => {
              const entries = day ? dateMap.get(day) ?? [] : [];
              const today = day ? isToday(day) : false;
              const isSelected = day !== null && day === selectedDate;
              const hasEntries = entries.length > 0;
              const isSun = di === 0;
              const isSat = di === 6;

              return (
                <div
                  key={`m-${wi}-${di}`}
                  onClick={() => day !== null && hasEntries && setSelectedDate(isSelected ? null : day)}
                  className={`min-h-[72px] border-b border-r border-gray-200 dark:border-gray-700 p-1 flex flex-col items-center ${
                    day === null
                      ? "bg-gray-50/50 dark:bg-gray-800/30"
                      : isSelected
                      ? "bg-blue-100 dark:bg-blue-900/40"
                      : today
                      ? "bg-blue-50 dark:bg-blue-950/20"
                      : hasEntries
                      ? "cursor-pointer active:bg-gray-100 dark:active:bg-gray-800"
                      : ""
                  }`}
                >
                  {day !== null && (
                    <>
                      <span className={`text-xs font-bold ${
                        isSelected
                          ? "text-blue-600 dark:text-blue-300"
                          : today
                          ? "text-blue-600 dark:text-blue-400"
                          : isSat
                          ? "text-blue-500"
                          : isSun
                          ? "text-red-500"
                          : "text-gray-700 dark:text-gray-400"
                      }`}>
                        {day}
                      </span>
                      {hasEntries && (() => {
                        const uniqueProfs = [...new Map(entries.map(e => [e.professor, e])).values()];
                        return (
                          <div className="flex flex-col items-center gap-[1px] mt-0.5 w-full">
                            {uniqueProfs.map((entry) => (
                              <div
                                key={entry.professor}
                                className={`rounded px-0.5 py-[1px] text-[8px] leading-tight w-full text-center truncate ${getProfessorBgClass(entry.professor)}`}
                              >
                                {entry.professor}
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Selected date detail */}
        {selectedDate !== null && selectedEntries.length > 0 && (
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2 px-1">
              <span className="font-bold text-sm text-gray-900 dark:text-white">
                {currentMonth}/{selectedDate}
              </span>
              <span className="text-xs text-gray-500">
                {selectedEntries.length}개 수업
              </span>
            </div>
            <div className="space-y-1.5">
              {selectedEntries.map((entry) => (
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
        )}
      </div>
    </div>
  );
}
