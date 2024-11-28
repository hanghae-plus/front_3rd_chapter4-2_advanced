import { Lecture } from "../../basic/types";
import { parseSchedule } from "../../basic/utils";

// 검색어 필터링 함수
export const matchLectureQuery = (lecture: Lecture, query: string) => {
  return (
    lecture.title.toLowerCase().includes(query.toLowerCase()) ||
    lecture.id.toLowerCase().includes(query.toLowerCase())
  );
};

// 성적 체크 합수
export const matchGrade = (lectureGrade: number, grades: number[]) => {
  return grades.length === 0 || grades.includes(lectureGrade);
};

// 전공 체크 함수
export const matchMajor = (lectureMajor: string, majors: string[]) => {
  return majors.length === 0 || majors.includes(lectureMajor);
};

// 학점 체크 함수
export const matchCredit = (lectureCredits: string, credits: number | undefined) => {
  return !credits || lectureCredits.startsWith(String(credits));
};

// 시간표 체크 함수 (days와 times 모두 처리)
export const matchesSchedule = (lectureSchedule: string, days: string[], times: number[]) => {
  // 시간 필터가 없으면 true
  if (days.length === 0 || times.length === 0) {
    return true;
  }

  // schedule이 없으면 false
  if (!lectureSchedule) {
    return false;
  }

  const schedules = parseSchedule(lectureSchedule);
  
  // 요일 체크
  const hasMatchedDays = schedules.some(s => days.includes(s.day));

  // 시간 체크
  const hasMatchedTimes = schedules.some(s => s.range.some(time => times.includes(time)));

  return hasMatchedDays && hasMatchedTimes;
};