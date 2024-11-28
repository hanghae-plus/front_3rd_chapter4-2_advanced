import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios, { AxiosResponse } from "axios";
import {
  Box,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { Lecture, SearchOption } from "./types.ts";
import { parseSchedule } from "./utils.ts";

import { useScheduleContext } from "./ScheduleContext.tsx";
import LectureRow from "./components/searchDialog/LectureRow.tsx";
import SelectMajorClass from "./components/searchDialog/SelectMajorClass.tsx";
import SelectTimeForm from "./components/searchDialog/SelectTimeForm.tsx";
import SelectCreditForm from "./components/searchDialog/SelectCreditForm.tsx";
import SearchKeywordForm from "./components/searchDialog/SearchKeywordForm.tsx";
import SelectGradeForm from "./components/searchDialog/SelectGradeForm.tsx";
import SelectDayForm from "./components/searchDialog/SelectDayForm.tsx";

interface Props {
  searchInfo: {
    tableId: string;
    day?: string;
    time?: number;
  } | null;
  onClose: () => void;
}

const PAGE_SIZE = 100;

const fetchMajors = () => axios.get<Lecture[]>("/schedules-majors.json");
const fetchLiberalArts = () => axios.get<Lecture[]>("/schedules-liberal-arts.json");

// TODO: 이 코드를 개선해서 API 호출을 최소화 해보세요 + Promise.all이 현재 잘못 사용되고 있습니다. 같이 개선해주세요.
const createCacheFetcher = <T extends unknown[], TResponse>(
  fetcher: (...args: T) => Promise<AxiosResponse<TResponse>>,
) => {
  const cache = new Map();

  return async (...args: T): Promise<AxiosResponse<TResponse>> => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = await fetcher(...args);
    cache.set(key, result);
    return result;
  };
};

const cacheFetchMajors = createCacheFetcher(fetchMajors);
const cacheFetchLiberalArts = createCacheFetcher(fetchLiberalArts);

const fetchAllLectures = async () =>
  await Promise.all([
    (console.log("API Call 1", performance.now()), cacheFetchMajors()),
    (console.log("API Call 2", performance.now()), cacheFetchLiberalArts()),
    (console.log("API Call 3", performance.now()), cacheFetchMajors()),
    (console.log("API Call 4", performance.now()), cacheFetchLiberalArts()),
    (console.log("API Call 5", performance.now()), cacheFetchMajors()),
    (console.log("API Call 6", performance.now()), cacheFetchLiberalArts()),
  ]);

// TODO: 이 컴포넌트에서 불필요한 연산이 발생하지 않도록 다양한 방식으로 시도해주세요.
const SearchDialog = ({ searchInfo, onClose }: Props) => {
  const { setSchedulesMap } = useScheduleContext();

  const loaderWrapperRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [page, setPage] = useState(1);
  const [searchOptions, setSearchOptions] = useState<SearchOption>({
    query: "",
    grades: [],
    days: [],
    times: [],
    majors: [],
  });

  const getFilteredLectures = useMemo(() => {
    const { query = "", credits, grades, days, times, majors } = searchOptions;
    return lectures
      .filter(
        lecture =>
          lecture.title.toLowerCase().includes(query.toLowerCase()) ||
          lecture.id.toLowerCase().includes(query.toLowerCase()),
      )
      .filter(lecture => grades.length === 0 || grades.includes(lecture.grade))
      .filter(lecture => majors.length === 0 || majors.includes(lecture.major))
      .filter(lecture => !credits || lecture.credits.startsWith(String(credits)))
      .filter(lecture => {
        if (days.length === 0) {
          return true;
        }
        const schedules = lecture.schedule ? parseSchedule(lecture.schedule) : [];
        return schedules.some(s => days.includes(s.day));
      })
      .filter(lecture => {
        if (times.length === 0) {
          return true;
        }
        const schedules = lecture.schedule ? parseSchedule(lecture.schedule) : [];
        return schedules.some(s => s.range.some(time => times.includes(time)));
      });
  }, [lectures, searchOptions]);

  const lastPage = Math.ceil(getFilteredLectures.length / PAGE_SIZE);
  const visibleLectures = useMemo(
    () => getFilteredLectures.slice(0, page * PAGE_SIZE),
    [getFilteredLectures, page],
  );
  const allMajors = useMemo(() => [...new Set(lectures.map(lecture => lecture.major))], [lectures]);

  const changeSearchOption = useCallback(
    (field: keyof SearchOption, value: SearchOption[typeof field]) => {
      setPage(1);
      setSearchOptions(prev => ({ ...prev, [field]: value }));
      loaderWrapperRef.current?.scrollTo(0, 0);
    },
    [],
  );

  const memoizedOnClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const memoizedAddSchedule = useCallback(
    (lecture: Lecture) => {
      if (!searchInfo) return;

      const { tableId } = searchInfo;

      const schedules = parseSchedule(lecture.schedule).map(schedule => ({
        ...schedule,
        lecture,
      }));

      setSchedulesMap(prev => ({
        ...prev,
        [tableId]: [...prev[tableId], ...schedules],
      }));

      memoizedOnClose();
    },
    [searchInfo, setSchedulesMap, memoizedOnClose],
  );

  useEffect(() => {
    const start = performance.now();
    console.log("API 호출 시작: ", start);
    fetchAllLectures().then(results => {
      const end = performance.now();
      console.log("모든 API 호출 완료 ", end);
      console.log("API 호출에 걸린 시간(ms): ", end - start);
      setLectures(results.flatMap(result => result.data));
    });
  }, []);

  useEffect(() => {
    const $loader = loaderRef.current;
    const $loaderWrapper = loaderWrapperRef.current;

    if (!$loader || !$loaderWrapper) {
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setPage(prevPage => Math.min(lastPage, prevPage + 1));
        }
      },
      { threshold: 0, root: $loaderWrapper },
    );

    observer.observe($loader);

    return () => observer.unobserve($loader);
  }, [lastPage]);

  useEffect(() => {
    setSearchOptions(prev => ({
      ...prev,
      days: searchInfo?.day ? [searchInfo.day] : [],
      times: searchInfo?.time ? [searchInfo.time] : [],
    }));
    setPage(1);
  }, [searchInfo]);

  return (
    <Modal isOpen={Boolean(searchInfo)} onClose={memoizedOnClose} size="6xl">
      <ModalOverlay />
      <ModalContent maxW="90vw" w="1000px">
        <ModalHeader>수업 검색</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <HStack spacing={4}>
              <SearchKeywordForm
                searchOptions={searchOptions}
                changeSearchOption={changeSearchOption}
              />

              <SelectCreditForm
                searchOptions={searchOptions}
                changeSearchOption={changeSearchOption}
              />
            </HStack>

            <HStack spacing={4}>
              <SelectGradeForm
                searchOptions={searchOptions}
                changeSearchOption={changeSearchOption}
              />

              <SelectDayForm
                searchOptions={searchOptions}
                changeSearchOption={changeSearchOption}
              />
            </HStack>

            <HStack spacing={4}>
              <SelectTimeForm
                searchOptions={searchOptions}
                changeSearchOption={changeSearchOption}
              />
              <SelectMajorClass
                searchOptions={searchOptions}
                allMajors={allMajors}
                changeSearchOption={changeSearchOption}
              />
            </HStack>

            <Text align="right">검색결과: {getFilteredLectures.length}개</Text>

            <Box>
              <Table>
                <Thead>
                  <Tr>
                    <Th width="100px">과목코드</Th>
                    <Th width="50px">학년</Th>
                    <Th width="200px">과목명</Th>
                    <Th width="50px">학점</Th>
                    <Th width="150px">전공</Th>
                    <Th width="150px">시간</Th>
                    <Th width="80px"></Th>
                  </Tr>
                </Thead>
              </Table>

              <Box overflowY="auto" maxH="500px" ref={loaderWrapperRef}>
                <Table size="sm" variant="striped">
                  <Tbody>
                    {visibleLectures.map((lecture, index) => (
                      <LectureRow
                        key={`${lecture.id}-${index}`}
                        lecture={lecture}
                        addSchedule={memoizedAddSchedule}
                      />
                    ))}
                  </Tbody>
                </Table>

                <Box ref={loaderRef} h="20px" />
              </Box>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SearchDialog;
