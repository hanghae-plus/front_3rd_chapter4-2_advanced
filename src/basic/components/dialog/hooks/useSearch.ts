import { useMemo, useState } from "react";
import { Lecture, SearchOption } from "../../../types";
import { filterByCredits, filterByDays, filterByGrades, filterByMajors, filterByQuery, filterByTimes } from "../../../lib/utils/searchDialogUtils";

export const useSearch = (lectures: Lecture[]) => {
  const [searchOptions, setSearchOptions] = useState<SearchOption>({
    query: "",
    grades: [],
    days: [],
    times: [],
    majors: [],
  });

  const filters = useMemo(() => ({
    query: filterByQuery(searchOptions.query || ""),
    grades: filterByGrades(searchOptions.grades),
    majors: filterByMajors(searchOptions.majors),
    credits: filterByCredits(searchOptions?.credits || 0),
    days: filterByDays(searchOptions.days),
    times: filterByTimes(searchOptions.times),
  }), [searchOptions]);

  const filteredLectures = useMemo(() => {
    return lectures
      .filter(filters.query)
      .filter(filters.grades)
      .filter(filters.majors)
      .filter(filters.credits)
      .filter(filters.days)
      .filter(filters.times)
  }, [lectures, filters]);

  return {
    searchOptions,
    setSearchOptions,
    filteredLectures,
  }
}