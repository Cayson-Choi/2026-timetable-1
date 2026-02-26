"use client";

import { Search, Filter, RotateCcw, ChevronDown } from "lucide-react";
import { FilterState, Department } from "@/lib/types";

interface ScheduleFilterProps {
  filters: FilterState;
  professors: string[];
  weeks: number[];
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;
  totalCount: number;
  filteredCount: number;
}

export function ScheduleFilter({
  filters,
  professors,
  weeks,
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

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 sm:p-5 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="교수명, 과목명, 강의실 검색..."
          value={filters.searchQuery}
          onChange={(e) => updateFilter("searchQuery", e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
        />
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap gap-3">
        {/* Professor */}
        <div className="relative flex-1 min-w-[160px]">
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
        <div className="relative min-w-[120px]">
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            학과
          </label>
          <div className="flex gap-1">
            {(["전체", "소방", "전기"] as const).map((dept) => (
              <button
                key={dept}
                onClick={() => updateFilter("department", dept as Department | "전체")}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filters.department === dept
                    ? dept === "소방"
                      ? "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 ring-1 ring-orange-300 dark:ring-orange-700"
                      : dept === "전기"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 ring-1 ring-blue-300 dark:ring-blue-700"
                      : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 ring-1 ring-gray-300 dark:ring-gray-600"
                    : "bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Week */}
        <div className="relative min-w-[120px]">
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
              {weeks.map((w) => (
                <option key={w} value={w}>
                  {w}주차
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
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
