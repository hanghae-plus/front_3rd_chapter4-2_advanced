export interface Lecture {
  id: string;
  title: string;
  credits: string;
  major: string;
  schedule: string;
  grade: number;
}

export interface Schedule {
  lecture: Lecture
  day: string;
  range: number[]
  room?: string;
}

export interface MajorsContextType {
  majors: Map<string, string>;
  addMajors: (lectures: Lecture[]) => void;
  getMajorLabel: (major: string) => string;
}

export type SearchOption = {
  query?: string;
  grades: number[];
  days: string[];
  times: number[];
  majors: string[];
  credits?: number;
}

export interface SearchConditionProps {
  searchOptions: SearchOption
  changeSearchOption: (field: keyof SearchOption, value: SearchOption[typeof field]) => void
  allMajors: string[]
}

export const COLORS = ["#fdd", "#ffd", "#dff", "#ddf", "#fdf", "#dfd"] as const;