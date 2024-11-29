import { useCallback, useState } from 'react'

export interface SearchOption {
  query?: string
  grades: number[]
  days: string[]
  times: number[]
  majors: string[]
  credits?: number
}

export const useSearchFilters = () => {
  const [searchOption, setSearchOption] = useState<SearchOption>({
    query: '',
    credits: undefined,
    grades: [],
    days: [],
    times: [],
    majors: [],
  })

  const setQuery = useCallback((value: string) => {
    setSearchOption((prev) => ({ ...prev, query: value }))
  }, [])

  const setCredits = useCallback((value: string) => {
    setSearchOption((prev) => ({ ...prev, credits: Number(value) }))
  }, [])

  const setGrades = useCallback((value: number[]) => {
    setSearchOption((prev) => ({ ...prev, grades: value }))
  }, [])

  const setDays = useCallback((value: string[]) => {
    setSearchOption((prev) => ({ ...prev, days: value }))
  }, [])

  const setSchedules = useCallback((value: number[]) => {
    setSearchOption((prev) => ({ ...prev, times: value }))
  }, [])

  const setMajors = useCallback((value: string[]) => {
    setSearchOption((prev) => ({ ...prev, majors: value }))
  }, [])

  const setInitialState = useCallback((initialState: Partial<SearchOption>) => {
    setSearchOption((prev) => ({ ...prev, ...initialState }))
  }, [])

  return {
    searchOption,
    setQuery,
    setCredits,
    setGrades,
    setDays,
    setSchedules,
    setMajors,
    setInitialState,
  }
}
