"use client";

import React, { useMemo } from "react";
import { ScheduleEntry } from "@/lib/types";
import { getProfessorBgClass, getAllProfessorColors } from "@/lib/professorColors";

interface WeeklyCalendarProps {
  data: ScheduleEntry[];
  week: number | null;
}

const WEEKDAYS = ["월", "화", "수", "목", "금"];
const WEEKDAYS_WITH_SAT = ["월", "화", "수", "목", "금", "토"];
const PERIODS_8 = [1, 2, 3, 4, 5, 6, 7, 8];
const PERIODS_9 = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const DAY_COLORS: Record<string, { header: string; text: string }> = {
  "월": { header: "bg-yellow-100 dark:bg-yellow-900/20", text: "text-yellow-700 dark:text-yellow-300" },
  "화": { header: "bg-pink-100 dark:bg-pink-900/20", text: "text-pink-700 dark:text-pink-300" },
  "수": { header: "bg-green-100 dark:bg-green-900/20", text: "text-green-700 dark:text-green-300" },
  "목": { header: "bg-purple-100 dark:bg-purple-900/20", text: "text-purple-700 dark:text-purple-300" },
  "금": { header: "bg-cyan-100 dark:bg-cyan-900/20", text: "text-cyan-700 dark:text-cyan-300" },
  "토": { header: "bg-rose-100 dark:bg-rose-900/20", text: "text-rose-700 dark:text-rose-300" },
};

export function WeeklyCalendar({ data, week }: WeeklyCalendarProps) {
  const targetWeek = week ?? (data.length > 0 ? data[0].week : 1);
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

  if (weekData.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400 dark:text-gray-500">
        <p className="text-lg font-medium">해당 주차에 수업이 없습니다</p>
        <p className="text-sm mt-1">다른 주차를 선택해 보세요</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Legend - 교수별 색상 안내 */}
      <div className="flex flex-wrap gap-2 justify-center">
        {weekProfessors.map(({ name, color }) => (
          <div key={name} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className={`w-3 h-3 rounded-full ${color.dot}`} />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{name}</span>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto">
        <div className={hasSaturday ? "min-w-[840px]" : "min-w-[700px]"}>
          <div className="text-center mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {targetWeek}주차 시간표
            </h3>
            {hasSaturday && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                P-TECH 토요일 수업 포함
              </p>
            )}
          </div>

          <div
            className={`grid ${gridCols} border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden`}
          >
            {/* Header */}
            <div className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-2" />
            {DAYS.map((day) => {
              const dayColor = DAY_COLORS[day];
              return (
                <div
                  key={day}
                  className={`border-b border-l border-gray-200 dark:border-gray-700 p-2 text-center ${dayColor.header}`}
                >
                  <div className={`font-bold ${dayColor.text}`}>{day}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {dayDates.get(day) || ""}
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

                  return (
                    <div
                      key={`${day}-${period}`}
                      className="border-b border-l border-gray-200 dark:border-gray-700 p-1 min-h-[60px]"
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
    </div>
  );
}
