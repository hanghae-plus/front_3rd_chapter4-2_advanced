export const createCachedApiCall = <T>(apiCall: () => Promise<T>) => {
  let cache: T | null = null;
  let fetchPromise: Promise<T> | null = null;

  return () => {
    if (cache) {
      // console.log("캐시된 데이터를 사용합니다.", performance.now());
      return Promise.resolve(cache);
    }
    if (fetchPromise) {
      // console.log("이전 요청을 기다립니다.", performance.now());
      return fetchPromise;
    }

    // console.log("새로운 요청을 시작합니다.", performance.now());

    fetchPromise = apiCall().then((result) => {
      cache = result;
      fetchPromise = null;
      return result;
    }).catch((error) => {
      fetchPromise = null;
      throw error;
    });
    return fetchPromise;
  }
}