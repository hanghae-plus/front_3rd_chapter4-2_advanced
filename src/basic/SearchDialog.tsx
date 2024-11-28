
import { useEffect, useCallback, useMemo } from 'react';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { parseSchedule } from './utils';
import { useScheduleContext } from './ScheduleContext.tsx';
import { Lecture } from './types.ts';
import LectureList from './components/LectureList.tsx';
import {
  CreditFilterForm,
  GradeFilterForm,
  MajorFilterForm,
  ScheduleFilterForm,
  SearchInputForm,
  DaysFilterForm,
} from './components/Filter';
import { useSearchFilters } from './hooks/useSearchFilters.ts';
import { useFetchLectures } from './hooks/useFetchLectures';
import { useLectureFilter } from './hooks/useLectureFilter';
import { useInfiniteScroll } from './hooks/useInfiniteScroll';

interface Props {
  searchInfo: {
    tableId: string;
    day?: string;
    time?: number;
  } | null;
  onClose: () => void;
}

const PAGE_SIZE = 100;

const SearchDialog = ({ searchInfo, onClose }: Props) => {
  const { handleAddSchedule } = useScheduleContext();
  const lectures = useFetchLectures();
  const {
    searchOption,
    setQuery,
    setCredits,
    setGrades,
    setDays,
    setSchedules,
    setMajors,
    setInitialState,
  } = useSearchFilters();
  const { query, credits, grades, days, times, majors } = searchOption; // query를 추출

  const filteredLectures = useLectureFilter(lectures, searchOption);
  const { loaderRef, loaderWrapperRef, page, setPage } = useInfiniteScroll(
    Math.ceil(filteredLectures.length / PAGE_SIZE)
  );

  const visibleLectures = useMemo(
    () => filteredLectures.slice(0, page * PAGE_SIZE),
    [filteredLectures, page]
  );

  const allMajors = useMemo(
    () => [...new Set(lectures.map((lecture) => lecture.major))],
    [lectures]
  );

  const addSchedule = useCallback(
    (lecture: Lecture) => {
      if (!searchInfo) return;
      const { tableId } = searchInfo;
      const schedules = parseSchedule(lecture.schedule).map((schedule) => ({
        ...schedule,
        lecture,
      }));
      handleAddSchedule(tableId, schedules);
      onClose();
    },
    [handleAddSchedule, searchInfo, onClose]
  );

  useEffect(() => {
    setInitialState({
      days: searchInfo?.day ? [searchInfo.day] : [],
      times: searchInfo?.time ? [searchInfo.time] : [],
    });
    setPage(1);
  }, [setInitialState, searchInfo]);

  return (
    <Modal isOpen={Boolean(searchInfo)} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent maxW="90vw" w="1000px">
        <ModalHeader>수업 검색</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <HStack spacing={4}>
              <SearchInputForm value={query} onChange={setQuery} />
              <CreditFilterForm value={credits?.toString()} onChange={setCredits} />
            </HStack>

            <HStack spacing={4}>
              <GradeFilterForm value={grades} onChange={setGrades} />
              <DaysFilterForm value={days} onChange={setDays} />
            </HStack>

            <HStack spacing={4}>
              <ScheduleFilterForm value={times} onChange={setSchedules} />
              <MajorFilterForm value={majors} onChange={setMajors} allMajors={allMajors} />
            </HStack>
            <Text align="right">검색결과: {filteredLectures.length}개</Text>
            <LectureList
              visibleLectures={visibleLectures}
              addSchedule={addSchedule}
              loaderRef={loaderRef}
              loaderWrapperRef={loaderWrapperRef}
            />
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SearchDialog;
