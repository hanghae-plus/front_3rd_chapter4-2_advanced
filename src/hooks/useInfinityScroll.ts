import { useEffect, useRef, useState, useCallback } from 'react'

interface InfiniteScrollReturn {
  loaderRef: React.RefObject<HTMLDivElement>
  loaderWrapperRef: React.RefObject<HTMLDivElement>
  page: number
  updatePage: (newPage: number) => void
}

export const useInfiniteScroll = (lastPage: number): InfiniteScrollReturn => {
  const loaderWrapperRef = useRef<HTMLDivElement>(null)
  const loaderRef = useRef<HTMLDivElement>(null)
  const [page, setPage] = useState(1)

  const updatePage = useCallback(
    (newPage: number) => {
      setPage((_) => Math.min(lastPage, newPage))
    },
    [lastPage],
  )

  useEffect(() => {
    const loader = loaderRef.current
    const loaderWrapper = loaderWrapperRef.current

    if (!loader || !loaderWrapper) {
      return
    }

    const observerOptions = {
      threshold: 0,
      root: loaderWrapper,
    }

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting) {
        updatePage(page + 1)
      }
    }

    const observer = new IntersectionObserver(handleIntersection, observerOptions)
    observer.observe(loader)

    return () => {
      if (loader) {
        observer.unobserve(loader)
      }
    }
  }, [lastPage, updatePage, page])

  return {
    loaderRef,
    loaderWrapperRef,
    page,
    updatePage
  }
}
