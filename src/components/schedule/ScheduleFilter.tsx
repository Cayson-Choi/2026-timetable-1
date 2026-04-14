"use client";

import { Search, RotateCcw, ChevronDown, CalendarDays } from "lucide-react";
import { FilterState, DepartmentFilter, ViewMode } from "@/lib/types";

interface ScheduleFilterProps {
  filters: FilterState;
  professors: string[];
  weeks: number[];
  weekDateRanges: Map<number, { startSort: string; endSort: string; start: string; end: string }>;
  viewMode: ViewMode;
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;
  totalCount: number;
  filteredCount: number;
}

const departmentButtons: { id: DepartmentFilter; label: string; activeClass: string }[] = [
  {
    id: "전체",
    label: "전체",
    activeClass: "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 ring-1 ring-gray-300 dark:ring-gray-600",
  },
  {
    id: "전문기술",
    label: "전문기술",
    activeClass: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300 ring-1 ring-sky-300 dark:ring-sky-700",
  },
  {
    id: "소방",
    label: "소방",
    activeClass: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 ring-1 ring-orange-300 dark:ring-orange-700",
  },
  {
    id: "전기",
    label: "전기",
    activeClass: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 ring-1 ring-blue-300 dark:ring-blue-700",
  },
  {
    id: "학위과정",
    label: "학위과정",
    activeClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 ring-1 ring-emerald-300 dark:ring-emerald-700",
  },
  {
    id: "1학년",
    label: "1학년",
    activeClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 ring-1 ring-emerald-300 dark:ring-emerald-700",
  },
  {
    id: "2학년",
    label: "2학년",
    activeClass: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 ring-1 ring-violet-300 dark:ring-violet-700",
  },
  {
    id: "중장년",
    label: "중장년",
    activeClass: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300 ring-1 ring-pink-300 dark:ring-pink-700",
  },
];

const DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"];

function getTodayDisplay(): string {
  const now = new Date();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  const day = DAY_NAMES[now.getDay()];
  return `${m}월 ${d}일 (${day})`;
}

export function ScheduleFilter({
  filters,
  professors,
  weeks,
  weekDateRanges,
  viewMode,
  updateFilter,
  resetFilters,
  totalCount,
  filteredCount,
}: ScheduleFilterProps) {
  const hasActiveFilters =
    filters.professor !== "전체" ||
    filters.department !== "전체" ||
    filters.searchQuery !== "" ||
    filters.week !== null;

  const todayDisplay = getTodayDisplay();
  const isCalendarView = viewMode === "calendar";

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 sm:p-5 space-y-4">
      {/* Today + Search */}
      <div className="flex items-center gap-2 text-sm">
        <CalendarDays className="w-4 h-4 text-blue-500" />
        <span className="font-medium text-gray-700 dark:text-gray-300">오늘</span>
        <span className="font-bold text-blue-600 dark:text-blue-400">{todayDisplay}</span>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="교수명, 과목명, 강의실, 학과 검색..."
          value={filters.searchQuery}
          onChange={(e) => updateFilter("searchQuery", e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
        />
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap gap-3">
        {/* Professor */}
        <div className="relative w-full sm:w-auto sm:flex-1 sm:min-w-[160px]">
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            교수
          </label>
          <div className="relative">
            <select
              value={filters.professor}
              onChange={(e) => updateFilter("professor", e.target.value)}
              className="w-full appearance-none pl-3 pr-8 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all cursor-pointer"
            >
              {professors.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Department */}
        <div className="relative">
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            학과/과정
          </label>
          <div className="flex flex-wrap gap-1">
            {departmentButtons.map((dept) => (
              <button
                key={dept.id}
                onClick={() => updateFilter("department", dept.id)}
                className={`px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  filters.department === dept.id
                    ? dept.activeClass
                    : "bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {dept.label}
              </button>
            ))}
          </div>
        </div>

        {/* Week - 캘린더 뷰일 때 숨김 */}
        {!isCalendarView && (
          <div className="relative w-full sm:w-auto sm:min-w-[200px]">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              주차
            </label>
            <div className="relative">
              <select
                value={filters.week ?? ""}
                onChange={(e) =>
                  updateFilter("week", e.target.value ? Number(e.target.value) : null)
                }
                className="w-full appearance-none pl-3 pr-8 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all cursor-pointer"
              >
                <option value="">전체</option>
                {weeks.map((w) => {
                  const range = weekDateRanges.get(w);
                  const rangeStr = range
                    ? range.start === range.end
                      ? ` (${range.start})`
                      : ` (${range.start}~${range.end})`
                    : "";
                  return (
                    <option key={w} value={w}>
                      {w}주차{rangeStr}
                    </option>
                  );
                })}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        )}
      </div>

      {/* Result count & Reset */}
      <div className="flex items-center justify-between pt-1">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          <span className="font-semibold text-gray-900 dark:text-white">{filteredCount}</span>
          건 표시 중
          {filteredCount !== totalCount && (
            <span className="text-gray-400 dark:text-gray-500"> / 전체 {totalCount}건</span>
          )}
        </p>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            필터 초기화
          </button>
        )}
      </div>
    </div>
  );
}
