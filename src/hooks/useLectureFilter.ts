import { useMemo } from "react";
import { parseSchedule } from "../basic/utils";
import { Lecture, SearchOption } from "../basic/types";

export const useLectureFilter = (
  lectures: Lecture[],
  searchOptions: SearchOption
) => {
  return useMemo(() => {
    const { query = "", credits, grades, days, times, majors } = searchOptions;

    const searchText = query.toLowerCase();

    return lectures.filter((lecture) => {
      if (credits && !lecture.credits.startsWith(String(credits))) {
        return false;
      }

      if (grades.length > 0 && !grades.includes(lecture.grade)) {
        return false;
      }

      if (majors.length > 0 && !majors.includes(lecture.major)) {
        return false;
      }

      if (
        searchText &&
        !lecture.title.toLowerCase().includes(searchText) &&
        !lecture.id.toLowerCase().includes(searchText)
      ) {
        return false;
      }

      if (days.length > 0 || times.length > 0) {
        const schedules = lecture.schedule
          ? parseSchedule(lecture.schedule).map((schedule) => ({
              ...schedule,
              lecture, // Schedule 타입을 맞추기 위해 lecture 추가
            }))
          : [];

        if (days.length > 0) {
          const hasMatchingDay = schedules.some((s) => days.includes(s.day));
          if (!hasMatchingDay) return false;
        }

        if (times.length > 0) {
          const hasMatchingTime = schedules.some((s) =>
            s.range.some((time) => times.includes(time))
          );
          if (!hasMatchingTime) return false;
        }
      }

      return true;
    });
  }, [lectures, searchOptions]);
};
