import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ScheduleEntry, Department, ProfessorSummary } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDepartmentColor(dept: Department): string {
  switch (dept) {
    case "소방": return "orange";
    case "전기": return "blue";
    case "학위 1학년": return "emerald";
    case "학위 2학년": return "violet";
  }
}

export function getDepartmentBgClass(dept: Department): string {
  switch (dept) {
    case "소방":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
    case "전기":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    case "학위 1학년":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
    case "학위 2학년":
      return "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300";
  }
}

export function getDepartmentBorderClass(dept: Department): string {
  switch (dept) {
    case "소방": return "border-l-orange-500";
    case "전기": return "border-l-blue-500";
    case "학위 1학년": return "border-l-emerald-500";
    case "학위 2학년": return "border-l-violet-500";
  }
}

export function isPTECH(dept: Department): boolean {
  return dept === "학위 1학년" || dept === "학위 2학년";
}

export function formatPeriods(periods: number[]): string {
  if (periods.length === 0) return "";
  const sorted = [...periods].sort((a, b) => a - b);

  const ranges: string[] = [];
  let start = sorted[0];
  let end = sorted[0];

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === end + 1) {
      end = sorted[i];
    } else {
      ranges.push(start === end ? `${start}` : `${start}-${end}`);
      start = sorted[i];
      end = sorted[i];
    }
  }
  ranges.push(start === end ? `${start}` : `${start}-${end}`);

  return ranges.join(", ") + "교시";
}

export function getProfessorSummaries(
  schedules: ScheduleEntry[]
): ProfessorSummary[] {
  const profMap = new Map<
    string,
    { departments: Set<Department>; subjects: Set<string>; totalHours: number; totalClasses: number }
  >();

  for (const entry of schedules) {
    if (!profMap.has(entry.professor)) {
      profMap.set(entry.professor, {
        departments: new Set(),
        subjects: new Set(),
        totalHours: 0,
        totalClasses: 0,
      });
    }
    const prof = profMap.get(entry.professor)!;
    prof.departments.add(entry.department);
    prof.subjects.add(entry.subject);
    prof.totalHours += entry.periods.length;
    prof.totalClasses += 1;
  }

  return Array.from(profMap.entries())
    .map(([name, data]) => ({
      name,
      departments: Array.from(data.departments),
      subjects: Array.from(data.subjects),
      totalClasses: data.totalClasses,
      totalHours: data.totalHours,
    }))
    .sort((a, b) => b.totalHours - a.totalHours);
}

export function getUniqueValues<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

export function dayToNumber(day: string): number {
  const map: Record<string, number> = { "월": 1, "화": 2, "수": 3, "목": 4, "금": 5, "토": 6 };
  return map[day] ?? 0;
}

export function sortDateString(a: string, b: string): number {
  return a.localeCompare(b);
}

/** sortDate("2026-03-05") 형식과 오늘 날짜 비교 */
export function isToday(sortDate: string): boolean {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return sortDate === `${y}-${m}-${d}`;
}

/** "3/5" 형식의 date와 오늘 날짜 비교 */
export function isTodayByDate(date: string): boolean {
  const now = new Date();
  return date === `${now.getMonth() + 1}/${now.getDate()}`;
}
