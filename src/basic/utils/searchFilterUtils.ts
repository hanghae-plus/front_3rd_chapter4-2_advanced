import { Lecture } from '../types';
import { parseSchedule } from '../utils';

export const filterLecturesByQuery = (query: string) => (lecture: Lecture) =>
  lecture.title.toLowerCase().includes(query.toLowerCase()) ||
  lecture.id.toLowerCase().includes(query.toLowerCase());

export const filterLecturesByGrades = (grades: number[]) => (lecture: Lecture) =>
  grades.length === 0 || grades.includes(lecture.grade);

export const filterLecturesByMajors = (majors: string[]) => (lecture: Lecture) =>
  majors.length === 0 || majors.includes(lecture.major);

export const filterLecturesByCredits = (credits: number | undefined) => (lecture: Lecture) =>
  !credits || lecture.credits.startsWith(String(credits));

export const filterLecturesByDays = (days: string[]) => (lecture: Lecture) => {
  if (days.length === 0) return true;
  const schedules = lecture.schedule ? parseSchedule(lecture.schedule) : [];
  return schedules.some(schedule => days.includes(schedule.day));
};

export const filterLecturesByTimes = (times: number[]) => (lecture: Lecture) => {
  if (times.length === 0) return true;
  const schedules = lecture.schedule ? parseSchedule(lecture.schedule) : [];
  return schedules.some(schedule => schedule.range.some(time => times.includes(time)));
};
