import { createCachedFetch } from "../services/cache";

const cachedFetch = createCachedFetch();

// 각 API 엔드포인트에 대한 캐시된 fetch 함수
export const fetchMajors = () => cachedFetch("/schedules-majors.json");

export const fetchLiberalArts = () =>
  cachedFetch("/schedules-liberal-arts.json");

// 최적화된 병렬 API 호출
export const fetchAllLectures = async () => {
  console.log("API Calls Start", performance.now());

  // 각 타입당 한 번씩만 API를 호출하고 병렬로 실행
  const [majorsResponse, liberalArtsResponse] = await Promise.all([
    fetchMajors(),
    fetchLiberalArts(),
  ]);

  console.log("API Calls End", performance.now());

  // 중복 제거된 결과 반환
  return [majorsResponse, liberalArtsResponse];
};
