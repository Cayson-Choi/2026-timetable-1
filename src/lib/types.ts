export type Department = "소방" | "전기" | "P-TECH 1학년" | "P-TECH 2학년";

export interface ScheduleEntry {
  id: string;
  date: string; // "3/5" format
  day: string; // "월","화","수","목","금","토"
  periods: number[];
  subject: string;
  professor: string;
  classroom: string;
  department: Department;
  sortDate: string; // "2026-03-05" for sorting
  week: number; // 1~22
}

export interface ProfessorSummary {
  name: string;
  departments: Department[];
  subjects: string[];
  totalClasses: number;
  totalHours: number;
}

export type ViewMode = "table" | "calendar" | "card";

export type DepartmentFilter = Department | "전체" | "전문기술" | "P-TECH";

export interface FilterState {
  professor: string;
  department: DepartmentFilter;
  searchQuery: string;
  dateRange: { start: string; end: string } | null;
  week: number | null;
}
