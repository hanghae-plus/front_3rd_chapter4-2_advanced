type AxiosResponse<T> = { data: T };

export const createCachedFetch = <T,>(fetcher: () => Promise<AxiosResponse<T>>) => {
  let cache: Promise<T> | null = null;

  return () => {
    if (cache) {
      return { data: cache };
    }

    const response = fetcher();
    cache = response.then((res) => res.data);
    return response;
  };
};