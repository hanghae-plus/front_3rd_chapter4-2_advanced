import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from '@chakra-ui/react';
import { useScheduleContext } from './ScheduleContext.tsx';
import { Lecture } from './types.ts';
import { parseSchedule } from "./utils.ts";
import axios, { AxiosResponse } from "axios";
import SearchFilter, { SearchOption } from './components/SearchFilter.tsx';

interface Props {
  searchInfo: {
    tableId: string;
    day?: string;
    time?: number;
  } | null;
  onClose: () => void;
}

const PAGE_SIZE = 100;

const fetchMajors = (() => {
  let cachedPromise: Promise<AxiosResponse<Lecture[]>> | null = null

  return () => {
    if (cachedPromise === null) {
      cachedPromise = axios.get<Lecture[]>('/schedules-majors.json');
    }

    return cachedPromise;
  }
})()

const fetchLiberalArts = (() => {
  let cachedPromise: Promise<AxiosResponse<Lecture[]>> | null = null

  return () => {
    if (cachedPromise === null) {
      cachedPromise = axios.get<Lecture[]>('/schedules-liberal-arts.json');
    }

    return cachedPromise;
  }
})()

const fetchAllLectures = async () => await Promise.all([
  (console.log('API Call 1', performance.now()), fetchMajors()),
  (console.log('API Call 2', performance.now()), fetchLiberalArts()),
  (console.log('API Call 3', performance.now()), fetchMajors()),
  (console.log('API Call 4', performance.now()), fetchLiberalArts()),
  (console.log('API Call 5', performance.now()), fetchMajors()),
  (console.log('API Call 6', performance.now()), fetchLiberalArts()),
]);

const filterLectures = (currentLectures: Lecture[], filters: SearchOption) => {
  const { query = '', credits, grades, days, times, majors } = filters;
  return currentLectures
    .filter(lecture =>
      lecture.title.toLowerCase().includes(query.toLowerCase()) ||
      lecture.id.toLowerCase().includes(query.toLowerCase())
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
}

// TODO: 이 컴포넌트에서 불필요한 연산이 발생하지 않도록 다양한 방식으로 시도해주세요.
const SearchDialog = ({ searchInfo, onClose }: Props) => {
  const { setSchedulesMap } = useScheduleContext();

  const loaderWrapperRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [page, setPage] = useState(1);
  const [searchOptions, setSearchOptions] = useState<SearchOption>({
    query: '',
    grades: [],
    days: [],
    times: [],
    majors: [],
  });

  const filteredLectures = useMemo(() => {
    return filterLectures(lectures, searchOptions);
  }, [lectures, searchOptions]);

  const lastPage = Math.ceil(filteredLectures.length / PAGE_SIZE);
  const visibleLectures = filteredLectures.slice(0, page * PAGE_SIZE);
  const allMajors = useMemo(() => 
    [...new Set(lectures.map(lecture => lecture.major))], 
    [lectures]
  );

  const changeSearchOption = useCallback((field: keyof SearchOption, value: SearchOption[typeof field]) => {
    setPage(1);
    setSearchOptions(prev => ({ ...prev, [field]: value }));
    loaderWrapperRef.current?.scrollTo(0, 0);
  }, []);

  const addSchedule = (lecture: Lecture) => {
    if (!searchInfo) return;

    const { tableId } = searchInfo;

    const schedules = parseSchedule(lecture.schedule).map(schedule => ({
      ...schedule,
      lecture
    }));

    setSchedulesMap(prev => ({
      ...prev,
      [tableId]: [...prev[tableId], ...schedules]
    }));

    onClose();
  };

  useEffect(() => {
    const start = performance.now();
    console.log('API 호출 시작: ', start)
    fetchAllLectures().then(results => {
      const end = performance.now();
      console.log('모든 API 호출 완료 ', end)
      console.log('API 호출에 걸린 시간(ms): ', end - start)
      setLectures(results.flatMap(result => result.data));
    })
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
      { threshold: 0, root: $loaderWrapper }
    );

    observer.observe($loader);

    return () => observer.unobserve($loader);
  }, [lastPage]);

  useEffect(() => {
    setSearchOptions(prev => ({
      ...prev,
      days: searchInfo?.day ? [searchInfo.day] : [],
      times: searchInfo?.time ? [searchInfo.time] : [],
    }))
    setPage(1);
  }, [searchInfo]);

  return (
    <Modal isOpen={Boolean(searchInfo)} onClose={onClose} size="6xl">
      <ModalOverlay/>
      <ModalContent maxW="90vw" w="1000px">
        <ModalHeader>수업 검색</ModalHeader>
        <ModalCloseButton/>
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <SearchFilter
              allMajors={allMajors}
              searchOptions={searchOptions}
              onChangeOption={changeSearchOption}
            />

            <Text align="right">
              검색결과: {filteredLectures.length}개
            </Text>
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
                      <Tr key={`${lecture.id}-${index}`}>
                        <Td width="100px">{lecture.id}</Td>
                        <Td width="50px">{lecture.grade}</Td>
                        <Td width="200px">{lecture.title}</Td>
                        <Td width="50px">{lecture.credits}</Td>
                        <Td width="150px" dangerouslySetInnerHTML={{ __html: lecture.major }}/>
                        <Td width="150px" dangerouslySetInnerHTML={{ __html: lecture.schedule }}/>
                        <Td width="80px">
                          <Button size="sm" colorScheme="green" onClick={() => addSchedule(lecture)}>추가</Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
                <Box ref={loaderRef} h="20px"/>
              </Box>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SearchDialog;