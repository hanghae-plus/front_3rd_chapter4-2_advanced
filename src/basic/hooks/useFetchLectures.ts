import { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import { Lecture } from '../types';

const fetchMajors = () => axios.get<Lecture[]>('/schedules-majors.json');
const fetchLiberalArts = () => axios.get<Lecture[]>('/schedules-liberal-arts.json');

const createCachedApiFetcher = <T>(apiCall: () => Promise<AxiosResponse<T>>) => {
  let cachedDataPromise: Promise<T> | null = null;
  return () => {
    if (cachedDataPromise) {
      return { data: cachedDataPromise };
    }
    const apiResponse = apiCall();
    cachedDataPromise = apiResponse.then((response) => response.data);
    return apiResponse;
  };
};

const fetchMajorsWithCache = createCachedApiFetcher(fetchMajors);
const fetchLiberalArtsWithCache = createCachedApiFetcher(fetchLiberalArts);

export const useFetchLectures = () => {
  const [lectures, setLectures] = useState<Lecture[]>([]);

  useEffect(() => {

    const fetchAllLectures = async () => {
      const [majorsApiResponse, liberalArtsApiResponse] = await Promise.all([
      (console.log('API Call 1', performance.now()), fetchMajorsWithCache()),
      (console.log('API Call 2', performance.now()), fetchLiberalArtsWithCache()),
      (console.log('API Call 3', performance.now()), fetchMajorsWithCache()),
      (console.log('API Call 4', performance.now()), fetchLiberalArtsWithCache()),
      (console.log('API Call 5', performance.now()), fetchMajorsWithCache()),
      (console.log('API Call 6', performance.now()), fetchLiberalArtsWithCache()),
      ]);

      const majorsData = await majorsApiResponse.data;
      const liberalArtsData = await liberalArtsApiResponse.data;
      return [...majorsData, ...liberalArtsData];
    };

    const fetchLectures = async () => {
      const start = performance.now();
      console.log('API 호출 시작: ', start);
      const results = await fetchAllLectures();
      const end = performance.now();
      console.log('모든 API 호출 완료 ', end);
      console.log('API 호출에 걸린 시간(ms): ', end - start);
      setLectures(results);
    };

    fetchLectures();
  }, []);

  return lectures;
};
