import { useCallback, useEffect, useRef, useState } from "react";

export const useInfiniteScroll = <T, >({
  items,
  renderRow,
  chunkSize = 100
}: {
  items: T[];
  renderRow: (item: T, index: number) => React.ReactNode;
  chunkSize: number;
}) => {
  const [renderedRows, setRenderedRows] = useState<React.ReactNode[]>([]);
  const [currentChunk, setCurrentChunk] = useState(0);
  const loaderRef = useRef<HTMLDivElement>(null);
  const loaderWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (items.length > 0) {
      const initialRows = items
        .slice(0, chunkSize)
        .map((item, index) => renderRow(item, index));
      setRenderedRows(initialRows);
      setCurrentChunk(1);
    }
  }, [items, chunkSize]);

  const loadMoreRows = useCallback(() => {
    const startIdx = currentChunk * chunkSize;
    const endIdx = startIdx + chunkSize;
    
    if (startIdx < items.length) {
      const newRows = items
        .slice(startIdx, endIdx)
        .map((item, index) => renderRow(item, startIdx + index));
      setRenderedRows(prev => [...prev, ...newRows]);
      setCurrentChunk(prev => prev + 1);
    }
  }, [currentChunk, items, chunkSize, renderRow]);

  return {
    renderedRows,
    loaderRef,
    loaderWrapperRef,
    loadMoreRows
  };
}