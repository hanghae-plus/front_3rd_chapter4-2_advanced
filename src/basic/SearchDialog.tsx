import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useScheduleContext } from './ScheduleContext.tsx';
import { Lecture } from './types.ts';
import { parseSchedule } from "./utils.ts";
import { PAGE_SIZE } from '../page/model/constants.ts';
import { useFilteredLectures } from '../lecture/model/useFilteredLecture.ts';
import { useInfiniteScroll } from '../page/model/useInfiniteScroll.ts';
import { SearchOption } from '../search/model/Search.ts';
import { useLectureData } from '../lecture/model/useLectureData.ts';
import { SearchForm } from '../search/ui/SearchForm.tsx';
import { LectureListTableBox } from '../lecture/ui/LectureListTableBox.tsx';

interface Props {
  searchInfo: {
    tableId: string;
    day?: string;
    time?: number;
  } | null;
  onClose: () => void;
}

// TODO: 이 컴포넌트에서 불필요한 연산이 발생하지 않도록 다양한 방식으로 시도해주세요.
const SearchDialog = ({ searchInfo, onClose }: Props) => {
  const { setSchedulesMap } = useScheduleContext();

  const { lectures, isLoading, error } = useLectureData();

  const loaderWrapperRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [searchOptions, setSearchOptions] = useState<SearchOption>({
    query: '',
    grades: [],
    days: [],
    times: [],
    majors: [],
  });

  // 새로운 메모이제이션 코드 추가
  const filteredLectures = useFilteredLectures(lectures, searchOptions);

  const lastPage = useMemo(() => 
    Math.ceil(filteredLectures.length / PAGE_SIZE)
  , [filteredLectures.length]);

  const visibleLectures = useMemo(() => 
    filteredLectures.slice(0, page * PAGE_SIZE)
  , [filteredLectures, page]);

  const allMajors = useMemo(() => 
    [...new Set(lectures.map(lecture => lecture.major))]
  , [lectures]);

  const changeSearchOption = useCallback((field: keyof SearchOption, value: SearchOption[typeof field]) => {
    setPage(1);
    setSearchOptions(prev => ({ ...prev, [field]: value }));
    loaderWrapperRef.current?.scrollTo(0, 0);
  }, []);

  const addSchedule = useCallback((lecture: Lecture) => {
    if (!searchInfo) return;
    const schedules = parseSchedule(lecture.schedule).map(schedule => ({
      ...schedule,
      lecture
    }));
    setSchedulesMap(prev => ({
      ...prev,
      [searchInfo.tableId]: [...prev[searchInfo.tableId], ...schedules]
    }));
    onClose();
  }, [searchInfo, setSchedulesMap, onClose]);

  const handleLoadMore = useCallback(() => {
    setPage(prevPage => Math.min(lastPage, prevPage + 1));
  }, [lastPage]);

  useInfiniteScroll({
    targetRef: loaderRef,
    wrapperRef: loaderWrapperRef,
    totalPages: lastPage,
    onIntersect: handleLoadMore
  });

  useEffect(() => {
    setSearchOptions(prev => ({
      ...prev,
      days: searchInfo?.day ? [searchInfo.day] : [],
      times: searchInfo?.time ? [searchInfo.time] : [],
    }))
    setPage(1);
  }, [searchInfo]);

  if (error) {
    return (
      <Modal isOpen={Boolean(searchInfo)} onClose={onClose}>
        <ModalContent>
          <ModalHeader>오류 발생</ModalHeader>
          <ModalBody>
            데이터를 불러오는 중 오류가 발생했습니다: {error.message}
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Modal isOpen={Boolean(searchInfo)} onClose={onClose} size="6xl">
      <ModalOverlay/>
      <ModalContent maxW="90vw" w="1000px">
        <ModalHeader>수업 검색</ModalHeader>
        <ModalCloseButton/>
        {isLoading ? (
          <ModalBody>
            <Text>데이터를 불러오는 중입니다...</Text>
          </ModalBody>
        ) : (
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <SearchForm
                searchOptions={searchOptions}
                onChangeSearchOption={changeSearchOption}
                allMajors={allMajors}
              />
              <Text align="right">
                검색결과: {filteredLectures.length}개
              </Text>
              <LectureListTableBox
                lectures={visibleLectures}
                onAddLecture={addSchedule}
                loaderRef={loaderRef}
                wrapperRef={loaderWrapperRef}
              />
            </VStack>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
};

export default SearchDialog;