"use client";

import { ScheduleEntry } from "@/lib/types";
import { formatPeriods, getDepartmentBgClass, isToday } from "@/lib/utils";
import { getProfessorDotClass } from "@/lib/professorColors";
import { MapPin, Clock, BookOpen } from "lucide-react";

const DAY_BADGE: Record<string, string> = {
  "월": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  "화": "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
  "수": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  "목": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  "금": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
  "토": "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
};

interface ScheduleTableProps {
  data: ScheduleEntry[];
}

export function ScheduleTable({ data }: ScheduleTableProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400 dark:text-gray-500">
        <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p className="text-lg font-medium">검색 결과가 없습니다</p>
        <p className="text-sm mt-1">필터 조건을 변경해 보세요</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop: Table */}
      <div className="hidden sm:block overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/50">
              <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">
                날짜
              </th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">
                요일
              </th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">
                교시
              </th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">
                과목
              </th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">
                교수
              </th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">
                강의실
              </th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">
                학과
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {data.map((entry) => {
              const today = isToday(entry.sortDate);
              return (
                <tr
                  key={entry.id}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors ${
                    today ? "bg-blue-50/70 dark:bg-blue-950/30" : ""
                  }`}
                >
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5">
                      {entry.date}
                      {today && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500 text-white">
                          오늘
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                        DAY_BADGE[entry.day] ?? "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {entry.day}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      {formatPeriods(entry.periods)}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                    {entry.subject}
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                    <span className="inline-flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${getProfessorDotClass(entry.professor)}`} />
                      {entry.professor}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      {entry.classroom}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getDepartmentBgClass(
                        entry.department
                      )}`}
                    >
                      {entry.department}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile: Card list */}
      <div className="sm:hidden space-y-2">
        {data.map((entry) => {
          const today = isToday(entry.sortDate);
          return (
            <div
              key={entry.id}
              className={`rounded-lg border border-gray-200 dark:border-gray-800 p-3 ${
                today ? "bg-blue-50/70 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800" : ""
              }`}
            >
              {/* Top row: date + day + department */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold ${
                      DAY_BADGE[entry.day] ?? "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {entry.day}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {entry.date}
                  </span>
                  {today && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500 text-white">
                      오늘
                    </span>
                  )}
                </div>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${getDepartmentBgClass(
                    entry.department
                  )}`}
                >
                  {entry.department}
                </span>
              </div>
              {/* Subject */}
              <p className="font-semibold text-sm text-gray-900 dark:text-white mb-1.5">
                {entry.subject}
              </p>
              {/* Details */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                <span className="inline-flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${getProfessorDotClass(entry.professor)}`} />
                  {entry.professor}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatPeriods(entry.periods)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {entry.classroom}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
