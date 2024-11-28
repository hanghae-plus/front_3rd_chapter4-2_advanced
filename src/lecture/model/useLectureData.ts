import { useEffect, useState } from "react";
import { Lecture } from "../../basic/types";
import { createCachedFetch } from "../api/cachedAPI";
import axios from "axios";

interface UseLectureDataReturn {
  lectures: Lecture[];
  isLoading: boolean;
  error: Error | null;
}

// 개선된 방식 - 캐시를 사용한 효율적인 API 호출
const fetchMajors = createCachedFetch(() => axios.get<Lecture[]>("/schedules-majors.json"));
const fetchLiberalArts = createCachedFetch(() => axios.get<Lecture[]>("/schedules-majors.json"));
const fetchAllLecturesEfficient = async () => {
  // 동일하게 6번 호출하지만, 캐시로 인해 실제로는 2번만 네트워크 요청
  const [majorsResponse, liberalArtsResponse] = await Promise.all([
    (console.log('API Call 1', performance.now()), await fetchMajors()),
    (console.log('API Call 2', performance.now()), await fetchLiberalArts()),
    (console.log('API Call 3', performance.now()), await fetchMajors()),
    (console.log('API Call 4', performance.now()), await fetchLiberalArts()),
    (console.log('API Call 5', performance.now()), await fetchMajors()),
    (console.log('API Call 6', performance.now()), await fetchLiberalArts()),
  ]);
  const majors = await majorsResponse.data;
  const liberalArts = await liberalArtsResponse.data;

  return [...majors, ...liberalArts];
};

export const useLectureData = (): UseLectureDataReturn => {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);


  useEffect(() => {
    const fetchLectures = async () => {
      try {
        setIsLoading(true);
        const start = performance.now();
        console.log('API 호출 시작: ', start);

        const results = await fetchAllLecturesEfficient();
        
        const end = performance.now();
        console.log('모든 API 호출 완료 ', end);
        console.log('API 호출에 걸린 시간(ms): ', end - start);
        
        setLectures(results);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch lectures'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchLectures();
  }, []);

  return { lectures, isLoading, error };
};