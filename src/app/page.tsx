"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { ScheduleFilter } from "@/components/schedule/ScheduleFilter";
import { ScheduleTable } from "@/components/schedule/ScheduleTable";
import { ScheduleCard } from "@/components/schedule/ScheduleCard";
import { WeeklyCalendar } from "@/components/schedule/WeeklyCalendar";
import { StatsDashboard } from "@/components/stats/StatsDashboard";
import { useScheduleFilter } from "@/hooks/useScheduleFilter";
import { scheduleData } from "@/data/schedules";
import { ViewMode } from "@/lib/types";
import { Table, LayoutGrid, CalendarDays } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("schedule");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const {
    filters,
    filteredData,
    professors,
    weeks,
    weekDateRanges,
    updateFilter,
    resetFilters,
  } = useScheduleFilter(scheduleData);

  const viewModes = [
    { id: "table" as ViewMode, icon: Table, label: "테이블" },
    { id: "card" as ViewMode, icon: LayoutGrid, label: "카드" },
    { id: "calendar" as ViewMode, icon: CalendarDays, label: "캘린더" },
  ];

  return (
    <div className="min-h-screen">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {activeTab === "schedule" && (
          <>
            {/* Filter */}
            <ScheduleFilter
              filters={filters}
              professors={professors}
              weeks={weeks}
              weekDateRanges={weekDateRanges}
              viewMode={viewMode}
              updateFilter={updateFilter}
              resetFilters={resetFilters}
              totalCount={scheduleData.length}
              filteredCount={filteredData.length}
            />

            {/* View mode toggle */}
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 w-fit">
              {viewModes.map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => {
                    setViewMode(id);
                    if (id === "calendar" && filters.week !== null) updateFilter("week", null);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                    viewMode === id
                      ? "bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400"
                      : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>

            {/* Schedule View */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 sm:p-6">
              {viewMode === "table" && <ScheduleTable data={filteredData} />}
              {viewMode === "card" && <ScheduleCard data={filteredData} />}
              {viewMode === "calendar" && (
                <WeeklyCalendar data={filteredData} />
              )}
            </div>
          </>
        )}

        {activeTab === "stats" && <StatsDashboard data={scheduleData} />}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-400 dark:text-gray-500">
            <p>2026 스마트전기과 수업일정 관리 시스템</p>
            <p>한국폴리텍대학</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
