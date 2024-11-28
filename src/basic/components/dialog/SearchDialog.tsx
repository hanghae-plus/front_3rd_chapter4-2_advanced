/* eslint-disable @typescript-eslint/no-unused-vars */
import { memo, useCallback, useEffect, useMemo } from "react";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Lecture, SearchOption } from "../../types/index.ts";
import { parseSchedule } from "../../lib/utils/timeUtils.ts";
import { CHUNK_SIZE } from "../../constants/index.ts";
import { LectureRow } from "./LectureRow.tsx";
import { useScheduleContext } from "../../context/ScheduleContext.tsx";
import { SearchCondition } from "./SearchCondition.tsx";
import { SearchResults } from "./SearchResults.tsx";
import { useSearch } from "./hooks/useSearch.ts";
import { useInfiniteScroll } from "./hooks/useInfiniteScroll.ts";
import { useLectures } from "./hooks/useLectures.ts";
import { useIntersectionObserver } from "./hooks/useIntersectionObserver.ts";

interface Props {
  searchInfo: {
    tableId: string;
    day?: string;
    time?: number;
  } | null;
  onClose: () => void;
}

// TODO: 이 컴포넌트에서 불필요한 연산이 발생하지 않도록 다양한 방식으로 시도해주세요.
const SearchDialog = memo(({ searchInfo, onClose }: Props) => {
  const { setSchedulesMap } = useScheduleContext();

  const lectures = useLectures();
  const { searchOptions, setSearchOptions, filteredLectures, isDebouncing } =
    useSearch(lectures);
  const { renderedRows, loaderRef, loaderWrapperRef, loadMoreRows } =
    useInfiniteScroll({
      items: filteredLectures,
      renderRow: (item: Lecture, index: number) => (
        <LectureRow
          key={`${item.id}-${index}`}
          lecture={item}
          onAddSchedule={addSchedule}
        />
      ),
      chunkSize: CHUNK_SIZE,
    });

  useIntersectionObserver(loaderRef, loaderWrapperRef, loadMoreRows);

  const allMajors = useMemo(
    () => [...new Set(lectures.map((lecture) => lecture?.major))],
    [lectures]
  );

  const changeSearchOption = useCallback(
    (field: keyof SearchOption, value: SearchOption[typeof field]) => {
      setSearchOptions((prev) => ({ ...prev, [field]: value }));
      loaderWrapperRef.current?.scrollTo(0, 0);
    },
    [setSearchOptions, loaderWrapperRef]
  );

  const addSchedule = useCallback(
    (lecture: Lecture) => {
      if (!searchInfo) return;
      const { tableId } = searchInfo;
      const schedules = parseSchedule(lecture?.schedule).map((schedule) => ({
        ...schedule,
        lecture,
      }));

      setSchedulesMap((prev) => ({
        ...prev,
        [tableId]: [...prev[tableId], ...schedules],
      }));

      onClose();
    },
    [searchInfo, setSchedulesMap, onClose]
  );

  useEffect(() => {
    setSearchOptions((prev) => ({
      ...prev,
      days: searchInfo?.day ? [searchInfo.day] : [],
      times: searchInfo?.time ? [searchInfo.time] : [],
    }));
  }, [searchInfo]);

  return (
    <Modal isOpen={Boolean(searchInfo)} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent maxW="90vw" w="1000px">
        <ModalHeader>수업 검색</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <SearchCondition
              searchOptions={searchOptions}
              changeSearchOption={changeSearchOption}
              allMajors={allMajors}
            />
            <Text align="right">검색결과: {filteredLectures.length}개</Text>
            <SearchResults
              renderedRows={renderedRows}
              loaderRef={loaderRef}
              loaderWrapperRef={loaderWrapperRef}
              isLoading={isDebouncing}
            />
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
});

export default SearchDialog;
