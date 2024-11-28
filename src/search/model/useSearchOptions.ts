import { useCallback, useEffect, useState } from 'react';
import { SearchOption } from './Search';

export const useSearchOptions = (
  searchInfo: { day?: string; time?: number } | null
) => {
  const [searchOptions, setSearchOptions] = useState<SearchOption>({
    query: '',
    grades: [],
    days: [],
    times: [],
    majors: [],
    credits: undefined
  });

  const updateSearchOptions = {
    updateSearchQuery: useCallback((query: string) => {
      setSearchOptions((prev) => ({ ...prev, query }));
    }, []),
    updateSearchGrades: useCallback((grades: number[]) => {
      setSearchOptions((prev) => ({ ...prev, grades }));
    }, []),
    updateSearchDays: useCallback((days: string[]) => {
      setSearchOptions((prev) => ({ ...prev, days }));
    }, []),
    updateSearchTimes: useCallback((times: number[]) => {
      setSearchOptions((prev) => ({ ...prev, times }));
    }, []),
    updateSearchMajors: useCallback((majors: string[]) => {
      setSearchOptions((prev) => ({ ...prev, majors }));
    }, []),
    updateSearchCredits: useCallback((credits: number | undefined) => {
      setSearchOptions((prev) => ({ ...prev, credits }));
    }, [])
  };

  useEffect(() => {
    setSearchOptions((prev) => ({
      ...prev,
      days: searchInfo?.day ? [searchInfo.day] as string[] : [],
    }));
    setSearchOptions((prev) => ({
      ...prev,
      times: searchInfo?.time ? [searchInfo.time] as number[] : [],
    }));
  }, [searchInfo]);

  return {
    searchOptions,
    updateSearchOptions,
  };
};
