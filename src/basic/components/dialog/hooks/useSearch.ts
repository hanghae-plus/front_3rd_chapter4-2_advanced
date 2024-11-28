import { useMemo, useState } from "react";
import { Lecture, SearchOption } from "../../../types";
import { filterByCredits, filterByDays, filterByGrades, filterByMajors, filterByQuery, filterByTimes } from "../../../lib/utils/searchDialogUtils";
import { lazyFilter } from "../../../lib/utils/lazyFilter";
import { useDebounce } from "../../../hooks/useDebounce";

export const useSearch = (lectures: Lecture[]) => {
  const [searchOptions, setSearchOptions] = useState<SearchOption>({
    query: "",
    grades: [],
    days: [],
    times: [],
    majors: [],
  });

  const debounceOptions = useDebounce(searchOptions, 300);

  const filters = useMemo(() => [
    filterByQuery(debounceOptions.query || ""),
    filterByGrades(debounceOptions.grades),
    filterByMajors(debounceOptions.majors),
    filterByCredits(debounceOptions?.credits || 0),
    filterByDays(debounceOptions.days),
    filterByTimes(debounceOptions.times),
  ], [debounceOptions]);

  const filteredLectures = useMemo(() => {
    return [...lazyFilter(lectures, filters)]
  }, [lectures, filters]);

  return {
    searchOptions,
    setSearchOptions,
    filteredLectures,
    isDebouncing: debounceOptions !== searchOptions,
  }
}