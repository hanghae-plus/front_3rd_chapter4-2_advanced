import { useEffect, useRef, useState, useCallback } from 'react';

export const useInfiniteScroll = (lastPage: number) => {
  const loaderWrapperRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);

  const memoizedSetPage = useCallback(
    (newPage: number) => {
      setPage((prevPage) => Math.min(lastPage, newPage));
    },
    [lastPage]
  );

  useEffect(() => {
    const $loader = loaderRef.current;
    const $loaderWrapper = loaderWrapperRef.current;

    if (!$loader || !$loaderWrapper) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          memoizedSetPage(page + 1);
        }
      },
      { threshold: 0, root: $loaderWrapper }
    );

    observer.observe($loader);

    return () => observer.unobserve($loader);
  }, [lastPage, memoizedSetPage, page]);

  return { loaderRef, loaderWrapperRef, page, setPage: memoizedSetPage };
};
