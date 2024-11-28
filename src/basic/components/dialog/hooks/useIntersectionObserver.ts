import { useEffect } from "react"

export const useIntersectionObserver = (
  targetRef: React.RefObject<HTMLElement>,
  rootRef: React.RefObject<HTMLElement>,
  onIntersect: () => void,
) => {
  useEffect(() => {
    const target = targetRef.current
    const root = rootRef.current

    if (!target || !root) return

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          onIntersect();
        }
      },
      { threshold: 0, root }
    );

    observer.observe(target);
    return () => observer.unobserve(target);
  }, [targetRef, rootRef, onIntersect]);
}