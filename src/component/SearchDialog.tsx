import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Lecture } from '../type/types.ts';
import { parseSchedule } from '../util/utils.ts';
import axios from 'axios';
import SearchKeyword from './search-dialog/form/SearchKeyword.tsx';
import Credit from './search-dialog/form/Credit.tsx';
import Grade from './search-dialog/form/Grade.tsx';
import Days from './search-dialog/form/Days.tsx';
import Times from './search-dialog/form/Times.tsx';
import Major from './search-dialog/form/Major.tsx';
import LectureTable from './search-dialog/table/LectureTable.tsx';
import { useScheduleContext } from '../context/ScheduleContext';

interface SearchInfo {
  tableId: string;
  day?: string;
  time?: number;
}

interface Props {
  searchInfo: SearchInfo | null;
  onClose: () => void;
}

const PAGE_SIZE = 100;

const createAPICache = () => {
  const cache: Record<
    string,
    { promise: Promise<{ data: Lecture[] }>; result?: { data: Lecture[] } }
  > = {};

  return (key: string, fetchFunction: () => Promise<{ data: Lecture[] }>) => {
    if (cache[key]) {
      return cache[key].promise;
    }

    const fetchPromise = fetchFunction().then((result) => {
      cache[key].result = result;
      return result;
    });

    cache[key] = { promise: fetchPromise };
    return fetchPromise;
  };
};

const apiCache = createAPICache();

const fetchMajors = () => apiCache('majors', () => axios.get<Lecture[]>('/schedules-majors.json'));
const fetchLiberalArts = () =>
  apiCache('liberalArts', () => axios.get<Lecture[]>('/schedules-liberal-arts.json'));

// TODO: 이 코드를 개선해서 API 호출을 최소화 해보세요 + Promise.all이 현재 잘못 사용되고 있습니다. 같이 개선해주세요.
const fetchAllLectures = async () => {
  return await Promise.all([fetchMajors(), fetchLiberalArts()]).then((results) =>
    results.flatMap((result) => result.data)
  );
};

// TODO: 이 컴포넌트에서 불필요한 연산이 발생하지 않도록 다양한 방식으로 시도해주세요.
const SearchDialog = ({ searchInfo, onClose }: Props) => {
  const { setSchedulesMap } = useScheduleContext();

  const loaderWrapperRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [page, setPage] = useState(1);

  const [query, setQuery] = useState('');
  const [grades, setGrades] = useState<number[]>([]);
  const [days, setDays] = useState<string[]>([]);
  const [times, setTimes] = useState<number[]>([]);
  const [majors, setMajors] = useState<string[]>([]);
  const [credits, setCredits] = useState<number | undefined>();

  const changeQuery = useCallback((value: string) => setQuery(value), []);
  const changeGrades = useCallback((value: number[]) => setGrades(value), []);
  const changeDays = useCallback((value: string[]) => setDays(value), []);
  const changeTimes = useCallback((value: number[]) => setTimes(value), []);
  const changeMajors = useCallback((value: string[]) => setMajors(value), []);
  const changeCredits = useCallback((value: number | undefined) => setCredits(value), []);

  const filteredLectures = useMemo(() => {
    return lectures.filter((lecture) => {
      const matchesQuery =
        lecture.title.toLowerCase().includes(query.toLowerCase()) ||
        lecture.id.toLowerCase().includes(query.toLowerCase());

      const matchesGrade = grades.length === 0 || grades.includes(lecture.grade);

      const matchesMajor = majors.length === 0 || majors.includes(lecture.major);

      const matchesCredits = !credits || lecture.credits.startsWith(String(credits));

      const matchesDays =
        days.length === 0 ||
        (lecture.schedule && parseSchedule(lecture.schedule).some((s) => days.includes(s.day)));

      const matchesTimes =
        times.length === 0 ||
        (lecture.schedule &&
          parseSchedule(lecture.schedule).some((s) =>
            s.range.some((time) => times.includes(time))
          ));

      return (
        matchesQuery &&
        matchesGrade &&
        matchesMajor &&
        matchesCredits &&
        matchesDays &&
        matchesTimes
      );
    });
  }, [lectures, query, days, grades, times, majors, credits]);

  const lastPage = Math.ceil(filteredLectures.length / PAGE_SIZE);
  const visibleLectures = filteredLectures.slice(0, page * PAGE_SIZE);

  const allMajors = useMemo(() => {
    return [...new Set(lectures.map((lecture) => lecture.major))];
  }, [lectures]);

  const addSchedule = (lecture: Lecture) => {
    if (!searchInfo) return;

    const { tableId } = searchInfo;

    const schedules = parseSchedule(lecture.schedule).map((schedule) => ({
      ...schedule,
      lecture,
    }));

    setSchedulesMap((prev) => ({
      ...prev,
      [tableId]: [...prev[tableId], ...schedules],
    }));

    onClose();
  };

  useEffect(() => {
    const start = performance.now();
    console.log('API 호출 시작: ', start);
    fetchAllLectures().then((results) => {
      const end = performance.now();
      console.log('모든 API 호출 완료 ', end);
      console.log('API 호출에 걸린 시간(ms): ', end - start);
      setLectures(results);
    });
  }, []);

  useEffect(() => {
    const $loader = loaderRef.current;
    const $loaderWrapper = loaderWrapperRef.current;

    if (!$loader || !$loaderWrapper) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => Math.min(lastPage, prevPage + 1));
        }
      },
      { threshold: 0, root: $loaderWrapper }
    );

    observer.observe($loader);

    return () => observer.unobserve($loader);
  }, [lastPage]);

  useEffect(() => {
    setPage(1);
  }, [searchInfo]);

  return (
    <Modal isOpen={Boolean(searchInfo)} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent maxW="90vw" w="1000px">
        <ModalHeader>수업 검색</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <HStack spacing={4}>
              <SearchKeyword query={query} onChange={changeQuery} />
              <Credit credits={credits} onChange={changeCredits} />
            </HStack>

            <HStack spacing={4}>
              <Grade grades={grades} onChange={changeGrades} />
              <Days days={days} onChange={changeDays} />
            </HStack>

            <HStack spacing={4}>
              <Times times={times} onChange={changeTimes} />
              <Major majors={majors} onChange={changeMajors} allMajors={allMajors} />
            </HStack>

            <Text align="right">검색결과: {filteredLectures.length}개</Text>

            <LectureTable
              addSchedule={addSchedule}
              loaderWrapperRef={loaderWrapperRef}
              loaderRef={loaderRef}
              visibleLectures={visibleLectures}
            />
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SearchDialog;
