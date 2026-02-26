import { scheduleData } from "@/data/schedules";

export interface ProfessorColorScheme {
  bg: string;
  border: string;
  bar: string;
  dot: string;
}

// 17개의 시각적으로 확실히 구분되는 색상 팔레트
const COLOR_PALETTE: ProfessorColorScheme[] = [
  {
    bg: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200",
    border: "border-l-blue-500",
    bar: "from-blue-500 to-blue-600",
    dot: "bg-blue-500",
  },
  {
    bg: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-200",
    border: "border-l-rose-500",
    bar: "from-rose-500 to-rose-600",
    dot: "bg-rose-500",
  },
  {
    bg: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200",
    border: "border-l-emerald-500",
    bar: "from-emerald-500 to-emerald-600",
    dot: "bg-emerald-500",
  },
  {
    bg: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200",
    border: "border-l-amber-500",
    bar: "from-amber-500 to-amber-600",
    dot: "bg-amber-500",
  },
  {
    bg: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-200",
    border: "border-l-violet-500",
    bar: "from-violet-500 to-violet-600",
    dot: "bg-violet-500",
  },
  {
    bg: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-200",
    border: "border-l-cyan-500",
    bar: "from-cyan-500 to-cyan-600",
    dot: "bg-cyan-500",
  },
  {
    bg: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200",
    border: "border-l-orange-500",
    bar: "from-orange-500 to-orange-600",
    dot: "bg-orange-500",
  },
  {
    bg: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-200",
    border: "border-l-teal-500",
    bar: "from-teal-500 to-teal-600",
    dot: "bg-teal-500",
  },
  {
    bg: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-200",
    border: "border-l-pink-500",
    bar: "from-pink-500 to-pink-600",
    dot: "bg-pink-500",
  },
  {
    bg: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200",
    border: "border-l-indigo-500",
    bar: "from-indigo-500 to-indigo-600",
    dot: "bg-indigo-500",
  },
  {
    bg: "bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-200",
    border: "border-l-lime-500",
    bar: "from-lime-500 to-lime-600",
    dot: "bg-lime-500",
  },
  {
    bg: "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/30 dark:text-fuchsia-200",
    border: "border-l-fuchsia-500",
    bar: "from-fuchsia-500 to-fuchsia-600",
    dot: "bg-fuchsia-500",
  },
  {
    bg: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-200",
    border: "border-l-sky-500",
    bar: "from-sky-500 to-sky-600",
    dot: "bg-sky-500",
  },
  {
    bg: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200",
    border: "border-l-red-500",
    bar: "from-red-500 to-red-600",
    dot: "bg-red-500",
  },
  {
    bg: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200",
    border: "border-l-green-500",
    bar: "from-green-500 to-green-600",
    dot: "bg-green-500",
  },
  {
    bg: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200",
    border: "border-l-purple-500",
    bar: "from-purple-500 to-purple-600",
    dot: "bg-purple-500",
  },
  {
    bg: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200",
    border: "border-l-yellow-500",
    bar: "from-yellow-500 to-yellow-600",
    dot: "bg-yellow-500",
  },
];

// 모듈 로드 시 정렬된 교수 이름 기준으로 색상 자동 할당
const allProfessors = [...new Set(scheduleData.map((d) => d.professor))].sort();
const professorColorMap = new Map<string, ProfessorColorScheme>();
allProfessors.forEach((name, i) => {
  professorColorMap.set(name, COLOR_PALETTE[i % COLOR_PALETTE.length]);
});

/** 교수 색상 정보 전체 반환 */
export function getProfessorColor(name: string): ProfessorColorScheme {
  return professorColorMap.get(name) ?? COLOR_PALETTE[0];
}

/** 교수 배경 클래스 */
export function getProfessorBgClass(name: string): string {
  return getProfessorColor(name).bg;
}

/** 교수 보더 클래스 */
export function getProfessorBorderClass(name: string): string {
  return getProfessorColor(name).border;
}

/** 교수 바 그래디언트 클래스 */
export function getProfessorBarClass(name: string): string {
  return getProfessorColor(name).bar;
}

/** 교수 도트 클래스 */
export function getProfessorDotClass(name: string): string {
  return getProfessorColor(name).dot;
}

/** 전체 교수 색상 맵 (범례 표시용) */
export function getAllProfessorColors(): { name: string; color: ProfessorColorScheme }[] {
  return allProfessors.map((name) => ({
    name,
    color: professorColorMap.get(name)!,
  }));
}
