import { useMemo, useState } from "react";
import { Lecture, SearchOption } from "../../../types";
import {
  filterByCredits,
  filterByDays,
  filterByGrades,
  filterByMajors,
  filterByQuery,
  filterByTimes,
} from "../../../lib/utils/searchDialogUtils";
import { useDebounce } from "../../../hooks/useDebounce";

export const useSearch = (lectures: Lecture[]) => {
  const [searchOptions, setSearchOptions] = useState<SearchOption>({
    query: "",
    grades: [],
    days: [],
    times: [],
    majors: [],
  });

  const debouncedOptions = useDebounce(searchOptions, 300);

  const filteredLectures = useMemo(() => {
    const filters = [
      filterByQuery(debouncedOptions.query || ""),
      filterByGrades(debouncedOptions.grades),
      filterByMajors(debouncedOptions.majors),
      filterByCredits(debouncedOptions?.credits || 0),
      filterByDays(debouncedOptions.days),
      filterByTimes(debouncedOptions.times),
    ];
    return lectures.filter((lecture) =>
      filters.every((filter) => filter(lecture))
    );
  }, [lectures, debouncedOptions]);

  return {
    searchOptions,
    setSearchOptions,
    filteredLectures,
    isDebouncing: debouncedOptions !== searchOptions,
  };
};
