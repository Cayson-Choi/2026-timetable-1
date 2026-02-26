"use client";

import { ScheduleEntry } from "@/lib/types";
import { formatPeriods, getDepartmentBgClass } from "@/lib/utils";
import { MapPin, Clock, BookOpen, User } from "lucide-react";

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
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
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
          {data.map((entry) => (
            <tr
              key={entry.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
            >
              <td className="px-4 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                {entry.date}
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                <span
                  className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                    entry.day === "월"
                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                      : entry.day === "화"
                      ? "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300"
                      : entry.day === "수"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                      : entry.day === "목"
                      ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                      : entry.day === "금"
                      ? "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
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
                <span className="inline-flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-gray-400" />
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
          ))}
        </tbody>
      </table>
    </div>
  );
}
