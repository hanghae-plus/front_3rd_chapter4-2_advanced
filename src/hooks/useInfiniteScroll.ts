import { RefObject, useEffect } from "react";

interface UseInfiniteScrollProps {
  targetRef: RefObject<HTMLElement>;
  wrapperRef: RefObject<HTMLElement>;
  totalPages: number;
  onIntersect: () => void;
}

export const useInfiniteScroll = ({
  targetRef,
  wrapperRef,
  totalPages,
  onIntersect
}: UseInfiniteScrollProps) => {
  useEffect(() => {
    const $target = targetRef.current;
    const $wrapper = wrapperRef.current;

    if (!$target || !$wrapper) {
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          onIntersect();
        }
      },
      { threshold: 0, root: $wrapper }
    );

    observer.observe($target);
    return () => observer.unobserve($target);
  }, [targetRef, wrapperRef, onIntersect]);
};