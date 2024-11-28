export const createCachedFetch = <T>(apiFetcher: () => Promise<T>) => {
  let cache: Promise<T> | null = null;

  return () => {
    if (!cache) {
      console.log('새로운 API 호출', performance.now());
      cache = apiFetcher();
    } else {
      console.log('캐시된 데이터 사용', performance.now());
    }
    return cache;
  };
};
