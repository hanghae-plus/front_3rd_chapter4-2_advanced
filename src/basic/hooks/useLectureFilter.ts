import { useMemo, useCallback } from 'react';
import { Lecture } from '../types';
import { parseSchedule } from '../utils';
import { SearchOption } from './useSearchFilters';

export const useLectureFilter = (lectures: Lecture[], searchOption: SearchOption) => {
  const { query, credits, grades, days, times, majors } = searchOption;

  const filterLecture = useCallback(
    (lecture: Lecture) => {
      const searchRegex = query ? new RegExp(query, 'i') : null;

      if (searchRegex && !searchRegex.test(lecture.title) && !searchRegex.test(lecture.id)) {
        return false;
      }
      if (grades.length > 0 && !grades.includes(lecture.grade)) {
        return false;
      }
      if (majors.length > 0 && !majors.includes(lecture.major)) {
        return false;
      }
      if (credits && !lecture.credits.startsWith(String(credits))) {
        return false;
      }
      if (days.length > 0 || times.length > 0) {
        const schedules = lecture.schedule ? parseSchedule(lecture.schedule) : [];
        if (days.length > 0 && !schedules.some((s) => days.includes(s.day))) {
          return false;
        }
        if (
          times.length > 0 &&
          !schedules.some((s) => s.range.some((time) => times.includes(time)))
        ) {
          return false;
        }
      }
      return true;
    },
    [query, credits, grades, days, times, majors]
  );

  const filteredLectures = useMemo(() => {
    return lectures.filter(filterLecture);
  }, [lectures, filterLecture]);

  return filteredLectures;
};
