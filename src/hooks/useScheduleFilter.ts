"use client";

import { useState, useMemo } from "react";
import { ScheduleEntry, FilterState, DepartmentFilter } from "@/lib/types";
import { getUniqueValues, isPTECH } from "@/lib/utils";

function findCurrentWeek(data: ScheduleEntry[]): number | null {
  if (data.length === 0) return null;
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const today = `${y}-${m}-${d}`;

  // 주차별 날짜 범위
  const ranges = new Map<number, { min: string; max: string }>();
  for (const entry of data) {
    const r = ranges.get(entry.week);
    if (!r) {
      ranges.set(entry.week, { min: entry.sortDate, max: entry.sortDate });
    } else {
      if (entry.sortDate < r.min) r.min = entry.sortDate;
      if (entry.sortDate > r.max) r.max = entry.sortDate;
    }
  }

  const sorted = [...ranges.entries()].sort((a, b) => a[0] - b[0]);

  // 오늘이 포함된 주차 찾기
  for (const [week, { min, max }] of sorted) {
    if (today >= min && today <= max) return week;
  }
  // 오늘과 가장 가까운 다음 주차
  for (const [week, { min }] of sorted) {
    if (min > today) return week;
  }
  // 모두 지났으면 마지막 주차
  return sorted[sorted.length - 1]?.[0] ?? null;
}

export function useScheduleFilter(data: ScheduleEntry[]) {
  const initialWeek = useMemo(() => findCurrentWeek(data), [data]);

  const [filters, setFilters] = useState<FilterState>({
    professor: "전체",
    department: "전체",
    searchQuery: "",
    dateRange: null,
    week: initialWeek,
  });

  const professors = useMemo(
    () => ["전체", ...getUniqueValues(data.map((d) => d.professor)).sort()],
    [data]
  );

  const subjects = useMemo(
    () => getUniqueValues(data.map((d) => d.subject)).sort(),
    [data]
  );

  const weeks = useMemo(
    () => getUniqueValues(data.map((d) => d.week)).sort((a, b) => a - b),
    [data]
  );

  // 주차별 날짜 범위 계산
  const weekDateRanges = useMemo(() => {
    const ranges = new Map<number, { startSort: string; endSort: string; start: string; end: string }>();
    for (const entry of data) {
      const existing = ranges.get(entry.week);
      if (!existing) {
        ranges.set(entry.week, { startSort: entry.sortDate, endSort: entry.sortDate, start: entry.date, end: entry.date });
      } else {
        if (entry.sortDate < existing.startSort) { existing.startSort = entry.sortDate; existing.start = entry.date; }
        if (entry.sortDate > existing.endSort) { existing.endSort = entry.sortDate; existing.end = entry.date; }
      }
    }
    return ranges;
  }, [data]);

  const filteredData = useMemo(() => {
    let result = data;

    if (filters.professor !== "전체") {
      result = result.filter((d) => d.professor === filters.professor);
    }

    if (filters.department !== "전체") {
      if (filters.department === "전문기술") {
        result = result.filter((d) => d.department === "소방" || d.department === "전기");
      } else if (filters.department === "학위과정") {
        result = result.filter((d) => isPTECH(d.department));
      } else {
        result = result.filter((d) => d.department === filters.department);
      }
    }

    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          d.professor.toLowerCase().includes(q) ||
          d.subject.toLowerCase().includes(q) ||
          d.classroom.toLowerCase().includes(q) ||
          d.department.toLowerCase().includes(q)
      );
    }

    if (filters.week !== null) {
      result = result.filter((d) => d.week === filters.week);
    }

    return result.sort((a, b) => a.sortDate.localeCompare(b.sortDate));
  }, [data, filters]);

  const updateFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      professor: "전체",
      department: "전체",
      searchQuery: "",
      dateRange: null,
      week: null,
    });
  };

  return {
    filters,
    filteredData,
    professors,
    subjects,
    weeks,
    weekDateRanges,
    updateFilter,
    resetFilters,
  };
}
