import { useMemo } from "react";
import { matchCredit, matchesSchedule, matchGrade, matchLectureQuery, matchMajor } from "./Lecture";
import { Lecture } from "../../basic/types";
import { SearchOption } from "../../search/model/Search";

export const useFilteredLectures = (lectures: Lecture[], searchOptions: SearchOption) => {
  return useMemo(() => {
    const { query = '', credits, grades, days, times, majors } = searchOptions;

    // 1. 가장 빈번하게 사용되는 필터부터 적용
    let filtered = lectures;

    // 2. 단순 비교 필터를 먼저 적용 (연산 비용이 적은 순서대로)
    if (credits) {
      filtered = filtered.filter(lecture => matchCredit(lecture.credits, credits));
    }

    if (grades.length > 0) {
      filtered = filtered.filter(lecture => matchGrade(lecture.grade, grades));
    }

    if (majors.length > 0) {
      filtered = filtered.filter(lecture => matchMajor(lecture.major, majors));
    }

    // 3. 문자열 검색 필터 적용
    if (query) {
      filtered = filtered.filter(lecture => matchLectureQuery(lecture, query));
    }

    // 4. 가장 복잡한 연산인 시간표 필터를 마지막에 적용
    if (days.length > 0 || times.length > 0) {
      filtered = filtered.filter(lecture => matchesSchedule(lecture.schedule, days, times));
    }

    return filtered;
  }, [lectures, searchOptions]);
};