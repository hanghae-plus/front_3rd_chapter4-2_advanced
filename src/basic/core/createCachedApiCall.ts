export const createCachedApiCall = <T>(apiCall: () => Promise<T>) => {
  let cache: T | null = null;
  let fetchPromise: Promise<T> | null = null;

  return () => {
    if (cache) {
      return Promise.resolve(cache);
    }
    if (fetchPromise) {
      return fetchPromise;
    }

    fetchPromise = apiCall()
      .then((result) => {
        cache = result;
        fetchPromise = null;
        return result;
      })
      .catch((error) => {
        fetchPromise = null;
        throw error;
      });
    return fetchPromise;
  };
};
