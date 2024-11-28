import { useEffect, useRef, useState, useCallback, useMemo, memo } from 'react';
import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Table,
  Tag,
  TagCloseButton,
  TagLabel,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  Wrap,
} from '@chakra-ui/react';
import { useScheduleContext } from './context/ScheduleContext.tsx';
import { Lecture } from './types.ts';
import { parseSchedule } from "./utils.ts";
import axios from "axios";
import { DAY_LABELS } from './constants.ts';

interface Props {
  searchInfo: {
    tableId: string;
    day?: string;
    time?: number;
  } | null;
  onClose: () => void;
}

interface SearchOption {
  query?: string,
  grades: number[],
  days: string[],
  times: number[],
  majors: string[],
  credits?: number,
}

const TIME_SLOTS = [
  { id: 1, label: "09:00~09:30" },
  { id: 2, label: "09:30~10:00" },
  { id: 3, label: "10:00~10:30" },
  { id: 4, label: "10:30~11:00" },
  { id: 5, label: "11:00~11:30" },
  { id: 6, label: "11:30~12:00" },
  { id: 7, label: "12:00~12:30" },
  { id: 8, label: "12:30~13:00" },
  { id: 9, label: "13:00~13:30" },
  { id: 10, label: "13:30~14:00" },
  { id: 11, label: "14:00~14:30" },
  { id: 12, label: "14:30~15:00" },
  { id: 13, label: "15:00~15:30" },
  { id: 14, label: "15:30~16:00" },
  { id: 15, label: "16:00~16:30" },
  { id: 16, label: "16:30~17:00" },
  { id: 17, label: "17:00~17:30" },
  { id: 18, label: "17:30~18:00" },
  { id: 19, label: "18:00~18:50" },
  { id: 20, label: "18:55~19:45" },
  { id: 21, label: "19:50~20:40" },
  { id: 22, label: "20:45~21:35" },
  { id: 23, label: "21:40~22:30" },
  { id: 24, label: "22:35~23:25" },
];

const PAGE_SIZE = 100;

const fetchMajors = () => axios.get<Lecture[]>('/schedules-majors.json');
const fetchLiberalArts = () => axios.get<Lecture[]>('/schedules-liberal-arts.json');

// TODO: 이 코드를 개선해서 API 호출을 최소화 해보세요 + Promise.all이 현재 잘못 사용되고 있습니다. 같이 개선해주세요.
// await를 배열 내부에서 사용해서 발생하는 문제 -> 시작된 Promise를 모아서 실행시켜보기
// 중복호출문제 -> 캐싱, 클로저
const createApiCache = () => {
  const cache: {
    majors?: Promise<any>;
    liberalArts?: Promise<any>;
  } = {};

  return {
    getMajors: () => {
      if (!cache.majors) {
        cache.majors = fetchMajors();
      }
      return cache.majors;
    },
    getLiberalArts: () => {
      if (!cache.liberalArts) {
        cache.liberalArts = fetchLiberalArts();
      }
      return cache.liberalArts;
    }
  };
};

const apiCache = createApiCache();

const fetchAllLectures = async () => {
  const promise1 = (console.log('API Call 1', performance.now()), apiCache.getMajors());
  const promise2 = (console.log('API Call 2', performance.now()), apiCache.getLiberalArts());
  const promise3 = (console.log('API Call 3', performance.now()), apiCache.getMajors());
  const promise4 = (console.log('API Call 4', performance.now()), apiCache.getLiberalArts());
  const promise5 = (console.log('API Call 5', performance.now()), apiCache.getMajors());
  const promise6 = (console.log('API Call 6', performance.now()), apiCache.getLiberalArts());

  return Promise.all([
    promise1,
    promise2,
    promise3,
    promise4,
    promise5,
    promise6
  ]);
}

// 랜더링 개선 1차 - 전공목록 분리와 memo
const MajorCheckbox = memo(({ major, checked, onChange }: {
  major: string;
  checked: boolean;
  onChange: (major: string, checked: boolean) => void;
}) => (
  <Box>
    <Checkbox 
      size="sm" 
      isChecked={checked}
      onChange={(e) => onChange(major, e.target.checked)}
    >
      {major.replace(/<p>/gi, ' ')}
    </Checkbox>
  </Box>
));

const MajorSection = memo(({ 
  allMajors, 
  selectedMajors, 
  onChangeMajors 
}: {
  allMajors: string[];
  selectedMajors: string[];
  onChangeMajors: (value: string[]) => void;
}) => {
  // 체크박스 변경 핸들러
  const handleMajorChange = useCallback((major: string, checked: boolean) => {
    if (checked) {
      onChangeMajors([...selectedMajors, major]);
    } else {
      onChangeMajors(selectedMajors.filter(m => m !== major));
    }
  }, [selectedMajors, onChangeMajors]);

  return (
    <FormControl>
      <FormLabel>전공</FormLabel>
      <CheckboxGroup
        colorScheme="green"
        value={selectedMajors}
      >
        
        <Wrap spacing={1} mb={2}>
          {selectedMajors.map(major => (
            <Tag key={major} size="sm" variant="outline" colorScheme="blue">
              <TagLabel>{major.split("<p>").pop()}</TagLabel>
              <TagCloseButton
                onClick={() => handleMajorChange(major, false)}
              />
            </Tag>
          ))}
        </Wrap>
        
        <Stack 
          spacing={2} 
          overflowY="auto" 
          h="100px" 
          border="1px solid" 
          borderColor="gray.200"
          borderRadius={5} 
          p={2}
        >
          {allMajors.map(major => (
            <MajorCheckbox
              key={major}
              major={major}
              checked={selectedMajors.includes(major)}
              onChange={handleMajorChange}
            />
          ))}
        </Stack>
      </CheckboxGroup>
    </FormControl>
  );
});

// 랜더링 개선 2차 - 강의목록 분리와 memo
const LectureRow = memo(({ lecture, onAdd }: { 
  lecture: Lecture; 
  onAdd: (lecture: Lecture) => void; 
}) => (
  <Tr>
    <Td width="100px">{lecture.id}</Td>
    <Td width="50px">{lecture.grade}</Td>
    <Td width="200px">{lecture.title}</Td>
    <Td width="50px">{lecture.credits}</Td>
    <Td width="150px" dangerouslySetInnerHTML={{ __html: lecture.major }}/>
    <Td width="150px" dangerouslySetInnerHTML={{ __html: lecture.schedule }}/>
    <Td width="80px">
      <Button 
        size="sm" 
        colorScheme="green" 
        onClick={() => onAdd(lecture)}
      >
        추가
      </Button>
    </Td>
  </Tr>
));

// 강의 테이블 컴포넌트
const LectureTable = memo(({ 
  lectures, 
  onAdd,
  loaderRef 
}: {
  lectures: Lecture[];
  onAdd: (lecture: Lecture) => void;
  loaderRef: React.RefObject<HTMLDivElement>;
}) => (
  <>
    <Table size="sm" variant="striped">
      <Tbody>
        {lectures.map((lecture, index) => (
          <LectureRow
            key={`${lecture.id}-${index}`}
            lecture={lecture}
            onAdd={onAdd}
          />
        ))}
      </Tbody>
    </Table>
    <Box ref={loaderRef} h="20px"/>
  </>
));


// TODO: 이 컴포넌트에서 불필요한 연산이 발생하지 않도록 다양한 방식으로 시도해주세요.
// useMemo와 useCallback 사용해보기
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

  const getFilteredLectures = useCallback(() => {
    const { query = '', credits, grades, days, times, majors } = searchOptions;
    return lectures
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
  }, [lectures, searchOptions])



  const filteredLectures = useMemo(() => getFilteredLectures(), [getFilteredLectures]);
  const lastPage = useMemo(() => Math.ceil(filteredLectures.length / PAGE_SIZE), [filteredLectures.length]);
  const visibleLectures = useMemo(() => 
    filteredLectures.slice(0, page * PAGE_SIZE), 
    [filteredLectures, page]
  );
  const allMajors = useMemo(() => 
    [...new Set(lectures.map(lecture => lecture.major))], 
    [lectures]
  );

  const changeSearchOption = useCallback((
    field: keyof SearchOption, 
    value: SearchOption[typeof field]
  ) => {
    setPage(1);
    setSearchOptions(prev => ({ ...prev, [field]: value }));
    loaderWrapperRef.current?.scrollTo(0, 0);
  }, []);

  const addSchedule = useCallback((lecture: Lecture) => {
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
  }, [searchInfo, setSchedulesMap, onClose]);
  

  const handleMajorsChange = useCallback((majors: string[]) => {
    changeSearchOption('majors', majors);
  }, [changeSearchOption]);




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
            <HStack spacing={4}>
              <FormControl>
                <FormLabel>검색어</FormLabel>
                <Input
                  placeholder="과목명 또는 과목코드"
                  value={searchOptions.query}
                  onChange={(e) => changeSearchOption('query', e.target.value)}
                />
              </FormControl>

              <FormControl>
                <FormLabel>학점</FormLabel>
                <Select
                  value={searchOptions.credits}
                  onChange={(e) => changeSearchOption('credits', e.target.value)}
                >
                  <option value="">전체</option>
                  <option value="1">1학점</option>
                  <option value="2">2학점</option>
                  <option value="3">3학점</option>
                </Select>
              </FormControl>
            </HStack>

            <HStack spacing={4}>
              <FormControl>
                <FormLabel>학년</FormLabel>
                <CheckboxGroup
                  value={searchOptions.grades}
                  onChange={(value) => changeSearchOption('grades', value.map(Number))}
                >
                  <HStack spacing={4}>
                    {[1, 2, 3, 4].map(grade => (
                      <Checkbox key={grade} value={grade}>{grade}학년</Checkbox>
                    ))}
                  </HStack>
                </CheckboxGroup>
              </FormControl>

              <FormControl>
                <FormLabel>요일</FormLabel>
                <CheckboxGroup
                  value={searchOptions.days}
                  onChange={(value) => changeSearchOption('days', value as string[])}
                >
                  <HStack spacing={4}>
                    {DAY_LABELS.map(day => (
                      <Checkbox key={day} value={day}>{day}</Checkbox>
                    ))}
                  </HStack>
                </CheckboxGroup>
              </FormControl>
            </HStack>

            <HStack spacing={4}>
              <FormControl>
                <FormLabel>시간</FormLabel>
                <CheckboxGroup
                  colorScheme="green"
                  value={searchOptions.times}
                  onChange={(values) => changeSearchOption('times', values.map(Number))}
                >
                  <Wrap spacing={1} mb={2}>
                    {searchOptions.times.sort((a, b) => a - b).map(time => (
                      <Tag key={time} size="sm" variant="outline" colorScheme="blue">
                        <TagLabel>{time}교시</TagLabel>
                        <TagCloseButton
                          onClick={() => changeSearchOption('times', searchOptions.times.filter(v => v !== time))}/>
                      </Tag>
                    ))}
                  </Wrap>
                  <Stack spacing={2} overflowY="auto" h="100px" border="1px solid" borderColor="gray.200"
                         borderRadius={5} p={2}>
                    {TIME_SLOTS.map(({ id, label }) => (
                      <Box key={id}>
                        <Checkbox key={id} size="sm" value={id}>
                          {id}교시({label})
                        </Checkbox>
                      </Box>
                    ))}
                  </Stack>
                </CheckboxGroup>
              </FormControl>

              <MajorSection
                allMajors={allMajors}
                selectedMajors={searchOptions.majors}
                onChangeMajors={handleMajorsChange}
              />
            </HStack>
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
                <LectureTable
                  lectures={visibleLectures}
                  onAdd={addSchedule}
                  loaderRef={loaderRef}
                />
              </Box>
            </Box>


          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SearchDialog;