import axios from "axios";

type AxiosResponse<T> = { data: T };

export const createCachedFetch = <T,>() => {
  const cache = new Map<string, Promise<AxiosResponse<T>>>();
  
  const fetchWithCache = (key: string, fetchFn: () => Promise<AxiosResponse<T>>) => {
    if (!cache.has(key)) {
      cache.set(key, fetchFn().then(response => {
        return response;
      }));
    }
    return cache.get(key)!;
  };

  return {
    fetchMajors: () => fetchWithCache('majors', () => axios.get<T>('/schedules-majors.json')),
    fetchLiberalArts: () => fetchWithCache('liberal', () => axios.get<T>('/schedules-liberal-arts.json'))
  };
};