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