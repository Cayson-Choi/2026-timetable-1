"use client";

import { useState, useMemo } from "react";
import { ScheduleEntry, FilterState, DepartmentFilter } from "@/lib/types";
import { getUniqueValues, isPTECH } from "@/lib/utils";

export function useScheduleFilter(data: ScheduleEntry[]) {
  const [filters, setFilters] = useState<FilterState>({
    professor: "전체",
    department: "전체",
    searchQuery: "",
    dateRange: null,
    week: null,
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

  const filteredData = useMemo(() => {
    let result = data;

    if (filters.professor !== "전체") {
      result = result.filter((d) => d.professor === filters.professor);
    }

    if (filters.department !== "전체") {
      if (filters.department === "P-TECH") {
        // Show both P-TECH 1학년 and P-TECH 2학년
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
    updateFilter,
    resetFilters,
  };
}
