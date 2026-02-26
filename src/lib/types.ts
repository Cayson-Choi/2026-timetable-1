export type Department = "소방" | "전기";

export interface ScheduleEntry {
  id: string;
  date: string; // "3/5" format
  day: string; // "월","화","수","목","금"
  periods: number[];
  subject: string;
  professor: string;
  classroom: string;
  department: Department;
  sortDate: string; // "2026-03-05" for sorting
  week: number; // 1~19
}

export interface ProfessorSummary {
  name: string;
  departments: Department[];
  subjects: string[];
  totalClasses: number;
  totalHours: number;
}

export type ViewMode = "table" | "calendar" | "card";

export interface FilterState {
  professor: string;
  department: Department | "전체";
  searchQuery: string;
  dateRange: { start: string; end: string } | null;
  week: number | null;
}
