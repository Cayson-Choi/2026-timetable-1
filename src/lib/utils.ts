import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ScheduleEntry, Department, ProfessorSummary } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDepartmentColor(dept: Department): string {
  return dept === "소방" ? "orange" : "blue";
}

export function getDepartmentBgClass(dept: Department): string {
  return dept === "소방"
    ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
    : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
}

export function getDepartmentBorderClass(dept: Department): string {
  return dept === "소방"
    ? "border-l-orange-500"
    : "border-l-blue-500";
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
