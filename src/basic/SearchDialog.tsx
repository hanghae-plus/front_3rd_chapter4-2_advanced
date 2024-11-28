import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
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
} from "@chakra-ui/react";
import { Lecture, SearchOption } from "./types.ts";
import { parseSchedule } from "./utils.ts";
import axios, { AxiosResponse } from "axios";
import DaySelect from "../components/searchDialog/DaySelect.tsx";
import SearchInput from "../components/searchDialog/SearchInput.tsx";
import CreditSelect from "../components/searchDialog/CreditSelect.tsx";
import GradeSelect from "../components/searchDialog/GradeSelect.tsx";
import MajorSelect from "../components/searchDialog/MajorSelect.tsx";
import TimeSelect from "../components/searchDialog/TimeSelect.tsx";
import LectureTable from "../components/searchDialog/LectureTable.tsx";

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

const createCachedFetcher = () => {
	const cache: Record<string, Promise<AxiosResponse<Lecture[]>>> = {};

	return async (
		fetchFn: () => Promise<AxiosResponse<Lecture[]>>,
		cacheKey: string
	): Promise<AxiosResponse<Lecture[]>> => {
		if (cache[cacheKey] !== undefined) {
			return cache[cacheKey];
		}

		const response = fetchFn();
		cache[cacheKey] = response;

		return response;
	};
};

const cachedFetch = createCachedFetcher();

// TODO: 이 코드를 개선해서 API 호출을 최소화 해보세요 + Promise.all이 현재 잘못 사용되고 있습니다. 같이 개선해주세요.
// Promise.all 내부 await 삭제
const fetchAllLectures = async () =>
	await Promise.all([
		(console.log("API Call 1", performance.now()), cachedFetch(fetchMajors, "majors")),
		(console.log("API Call 2", performance.now()), cachedFetch(fetchLiberalArts, "liberalArts")),
		(console.log("API Call 3", performance.now()), cachedFetch(fetchMajors, "majors")),
		(console.log("API Call 4", performance.now()), cachedFetch(fetchLiberalArts, "liberalArts")),
		(console.log("API Call 5", performance.now()), cachedFetch(fetchMajors, "majors")),
		(console.log("API Call 6", performance.now()), cachedFetch(fetchLiberalArts, "liberalArts")),
	]);

// TODO: 이 컴포넌트에서 불필요한 연산이 발생하지 않도록 다양한 방식으로 시도해주세요.
const SearchDialog = memo(({ searchInfo, onClose }: Props) => {
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

	const getFilteredLectures = () => {
		const { query = "", credits, grades, days, times, majors } = searchOptions;
		return lectures
			.filter(
				(lecture) =>
					lecture.title.toLowerCase().includes(query.toLowerCase()) ||
					lecture.id.toLowerCase().includes(query.toLowerCase())
			)
			.filter((lecture) => grades.length === 0 || grades.includes(lecture.grade))
			.filter((lecture) => majors.length === 0 || majors.includes(lecture.major))
			.filter((lecture) => !credits || lecture.credits.startsWith(String(credits)))
			.filter((lecture) => {
				if (days.length === 0) {
					return true;
				}
				const schedules = lecture.schedule ? parseSchedule(lecture.schedule) : [];
				return schedules.some((s) => days.includes(s.day));
			})
			.filter((lecture) => {
				if (times.length === 0) {
					return true;
				}
				const schedules = lecture.schedule ? parseSchedule(lecture.schedule) : [];
				return schedules.some((s) => s.range.some((time) => times.includes(time)));
			});
	};

	const filteredLectures = useMemo(getFilteredLectures, [lectures, searchOptions]);
	const lastPage = Math.ceil(filteredLectures.length / PAGE_SIZE);
	const visibleLectures = filteredLectures.slice(0, page * PAGE_SIZE);
	const allMajors = useMemo(
		() => [...new Set(lectures.map((lecture) => lecture.major))],
		[lectures]
	);

	const onQueryChange = useCallback((value: string) => {
		setPage(1);
		setSearchOptions((prev) => ({ ...prev, query: value }));
		loaderWrapperRef.current?.scrollTo(0, 0);
	}, []);

	const onCreditsChange = useCallback((value: number) => {
		setPage(1);
		setSearchOptions((prev) => ({ ...prev, credits: value }));
		loaderWrapperRef.current?.scrollTo(0, 0);
	}, []);

	const onGradesChange = useCallback((value: number[]) => {
		setPage(1);
		setSearchOptions((prev) => ({ ...prev, grades: value }));
		loaderWrapperRef.current?.scrollTo(0, 0);
	}, []);

	const onDaysChange = useCallback((value: string[]) => {
		setPage(1);
		setSearchOptions((prev) => ({ ...prev, days: value }));
		loaderWrapperRef.current?.scrollTo(0, 0);
	}, []);

	const onTimesChange = useCallback((value: number[]) => {
		setPage(1);
		setSearchOptions((prev) => ({ ...prev, times: value }));
		loaderWrapperRef.current?.scrollTo(0, 0);
	}, []);

	const onMajorsChange = useCallback((value: string[]) => {
		setPage(1);
		setSearchOptions((prev) => ({ ...prev, majors: value }));
		loaderWrapperRef.current?.scrollTo(0, 0);
	}, []);

	useEffect(() => {
		const start = performance.now();
		console.log("API 호출 시작: ", start);
		fetchAllLectures().then((results) => {
			const end = performance.now();
			console.log("모든 API 호출 완료 ", end);
			console.log("API 호출에 걸린 시간(ms): ", end - start);
			setLectures(results.flatMap((result) => result.data));
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
		setSearchOptions((prev) => ({
			...prev,
			days: searchInfo?.day ? [searchInfo.day] : [],
			times: searchInfo?.time ? [searchInfo.time] : [],
		}));
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
							<SearchInput value={searchOptions.query} onQueryChange={onQueryChange} />
							<CreditSelect value={searchOptions.credits} onCreditsChange={onCreditsChange} />
						</HStack>

						<HStack spacing={4}>
							<GradeSelect value={searchOptions.grades} onGradesChange={onGradesChange} />
							<DaySelect value={searchOptions.days} onDaysChange={onDaysChange} />
						</HStack>

						<HStack spacing={4}>
							<TimeSelect times={searchOptions.times} onTimesChange={onTimesChange} />
							<MajorSelect
								majors={searchOptions.majors}
								onMajorsChange={onMajorsChange}
								allMajors={allMajors}
							/>
						</HStack>

						<Text align="right">검색결과: {filteredLectures.length}개</Text>

						<LectureTable
							loaderWrapperRef={loaderWrapperRef}
							visibleLectures={visibleLectures}
							loaderRef={loaderRef}
							searchInfo={searchInfo}
							onClose={onClose}
						/>
					</VStack>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
});

export default SearchDialog;
