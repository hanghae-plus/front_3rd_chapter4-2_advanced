import { Box, Button, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { Lecture } from "../../basic/types";
import { parseSchedule } from "../../basic/utils";
import { useScheduleContext } from "../../basic/ScheduleContext";
import { memo, useCallback } from "react";

interface Props {
	loaderWrapperRef: React.RefObject<HTMLDivElement>;
	visibleLectures: Lecture[];
	loaderRef: React.RefObject<HTMLDivElement>;
	searchInfo: {
		tableId: string;
		day?: string;
		time?: number;
	} | null;
	onClose: () => void;
}

const LectureTableRow = memo(
	({ lecture, addSchedule }: { lecture: Lecture; addSchedule: (lecture: Lecture) => void }) => {
		return (
			<Tr>
				<Td width="100px">{lecture.id}</Td>
				<Td width="50px">{lecture.grade}</Td>
				<Td width="200px">{lecture.title}</Td>
				<Td width="50px">{lecture.credits}</Td>
				<Td width="150px" dangerouslySetInnerHTML={{ __html: lecture.major }} />
				<Td width="150px" dangerouslySetInnerHTML={{ __html: lecture.schedule }} />
				<Td width="80px">
					<Button size="sm" colorScheme="green" onClick={() => addSchedule(lecture)}>
						추가
					</Button>
				</Td>
			</Tr>
		);
	}
);

const LectureTable = ({
	loaderWrapperRef,
	visibleLectures,
	loaderRef,
	searchInfo,
	onClose,
}: Props) => {
	const { handleAdd } = useScheduleContext();

	const addSchedule = useCallback(
		(lecture: Lecture) => {
			if (!searchInfo) return;

			const { tableId } = searchInfo;

			const schedules = parseSchedule(lecture.schedule).map((schedule) => ({
				...schedule,
				lecture,
			}));

			handleAdd({ tableId, schedules });

			onClose();
		},
		[searchInfo, handleAdd, onClose]
	);

	return (
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
							<LectureTableRow
								key={`${lecture.id}-${index}`}
								lecture={lecture}
								addSchedule={addSchedule}
							/>
						))}
					</Tbody>
				</Table>
				<Box ref={loaderRef} h="20px" />
			</Box>
		</Box>
	);
};

export default LectureTable;
