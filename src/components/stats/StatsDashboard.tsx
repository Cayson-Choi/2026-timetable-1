"use client";

import { ScheduleEntry, Department } from "@/lib/types";
import { getProfessorSummaries, getDepartmentBgClass } from "@/lib/utils";
import { getProfessorBarClass, getProfessorDotClass } from "@/lib/professorColors";
import { useMemo } from "react";
import { Users, Clock, BookOpen, Building2, BarChart3 } from "lucide-react";

interface StatsDashboardProps {
  data: ScheduleEntry[];
}

export function StatsDashboard({ data }: StatsDashboardProps) {
  const summaries = useMemo(() => getProfessorSummaries(data), [data]);

  const totalProfessors = summaries.length;
  const totalHours = summaries.reduce((sum, s) => sum + s.totalHours, 0);
  const totalSubjects = new Set(data.map((d) => d.subject)).size;
  const totalClassrooms = new Set(data.filter((d) => d.classroom !== "미지정").map((d) => d.classroom)).size;

  // Subject stats
  const subjectHours = useMemo(() => {
    const map = new Map<string, { hours: number; dept: Set<string> }>();
    for (const entry of data) {
      if (!map.has(entry.subject)) {
        map.set(entry.subject, { hours: 0, dept: new Set() });
      }
      const s = map.get(entry.subject)!;
      s.hours += entry.periods.length;
      s.dept.add(entry.department);
    }
    return Array.from(map.entries())
      .map(([name, d]) => ({ name, hours: d.hours, departments: Array.from(d.dept) }))
      .sort((a, b) => b.hours - a.hours);
  }, [data]);

  const maxProfHours = summaries.length > 0 ? summaries[0].totalHours : 1;
  const maxSubjHours = subjectHours.length > 0 ? subjectHours[0].hours : 1;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users, label: "교수/강사", value: totalProfessors, suffix: "명", color: "blue" },
          { icon: Clock, label: "총 수업시수", value: totalHours, suffix: "시간", color: "green" },
          { icon: BookOpen, label: "개설 과목", value: totalSubjects, suffix: "과목", color: "purple" },
          { icon: Building2, label: "강의실", value: totalClassrooms, suffix: "실", color: "orange" },
        ].map(({ icon: Icon, label, value, suffix, color }) => (
          <div
            key={label}
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  color === "blue"
                    ? "bg-blue-100 dark:bg-blue-900/30"
                    : color === "green"
                    ? "bg-green-100 dark:bg-green-900/30"
                    : color === "purple"
                    ? "bg-purple-100 dark:bg-purple-900/30"
                    : "bg-orange-100 dark:bg-orange-900/30"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    color === "blue"
                      ? "text-blue-600 dark:text-blue-400"
                      : color === "green"
                      ? "text-green-600 dark:text-green-400"
                      : color === "purple"
                      ? "text-purple-600 dark:text-purple-400"
                      : "text-orange-600 dark:text-orange-400"
                  }`}
                />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {value}
                  <span className="text-sm font-normal text-gray-400 ml-1">{suffix}</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Two columns: professor ranking & subject ranking */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Professor ranking */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              교수별 수업시수
            </h3>
          </div>
          <div className="space-y-3">
            {summaries.map((prof, i) => (
              <div key={prof.name} className="group">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 w-5">{i + 1}</span>
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${getProfessorDotClass(prof.name)}`} />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {prof.name}
                    </span>
                    <div className="flex gap-1">
                      {prof.departments.map((d) => (
                        <span
                          key={d}
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${getDepartmentBgClass(
                            d
                          )}`}
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {prof.totalHours}h
                  </span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                  <div
                    className={`bg-gradient-to-r ${getProfessorBarClass(prof.name)} h-2 rounded-full transition-all duration-500`}
                    style={{
                      width: `${(prof.totalHours / maxProfHours) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subject ranking */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              과목별 수업시수
            </h3>
          </div>
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {subjectHours.map((subj, i) => (
              <div key={subj.name}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 w-5">{i + 1}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[200px]">
                      {subj.name}
                    </span>
                    <div className="flex gap-1 shrink-0">
                      {subj.departments.map((d) => (
                        <span
                          key={d}
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${getDepartmentBgClass(
                            d as Department
                          )}`}
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 shrink-0 ml-2">
                    {subj.hours}h
                  </span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${(subj.hours / maxSubjHours) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
