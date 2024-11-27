import { Lecture } from "../types";
import { parseSchedule } from "../utils";

export const filterByQuery = (query: string) => (lecture: Lecture) =>
  lecture?.title.toLowerCase().includes(query.toLowerCase()) ||
  lecture?.id.toLowerCase().includes(query.toLowerCase());

export const filterByGrades = (grades: number[]) => (lecture: Lecture) =>
  grades.length === 0 || grades.includes(lecture.grade);

export const filterByMajors = (majors: string[]) => (lecture: Lecture) =>
  majors.length === 0 || majors.includes(lecture.major);

export const filterByCredits = (credits: number | undefined) => (lecture: Lecture) =>
  !credits || lecture.credits.startsWith(String(credits));

export const filterByDays = (days: string[]) => (lecture: Lecture) => {
  if (days.length === 0) return true;
  const schedules = lecture.schedule ? parseSchedule(lecture.schedule) : [];
  return schedules.some(s => days.includes(s.day));
};

export const filterByTimes = (times: number[]) => (lecture: Lecture) => {
  if (times.length === 0) return true;
  const schedules = lecture.schedule ? parseSchedule(lecture.schedule) : [];
  return schedules.some(s => s.range.some(time => times.includes(time)));
};