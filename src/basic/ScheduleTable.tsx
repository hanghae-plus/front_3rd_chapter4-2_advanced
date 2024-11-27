import { Box, Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import { CellSize, DAY_LABELS, 분 } from "./constants.ts";
import { Schedule } from "./types.ts";
import { parseHnM } from "./utils.ts";
import { memo, useCallback, useState } from "react";
import DayItem from "../components/scheduleTable/DayItem.tsx";
import TimeRow from "../components/scheduleTable/TimeRow.tsx";
import DraggableSchedule from "../components/scheduleTable/DraggableSchedule.tsx";
import { useDndMonitor } from "@dnd-kit/core";

interface Props {
	tableId: string;
	schedules: Schedule[];
	onScheduleTimeClick?: (timeInfo: { day: string; time: number }) => void;
	onDeleteButtonClick?: (timeInfo: { day: string; time: number }) => void;
}

const TIMES = [
	...Array(18)
		.fill(0)
		.map((v, k) => v + k * 30 * 분)
		.map((v) => `${parseHnM(v)}~${parseHnM(v + 30 * 분)}`),

	...Array(6)
		.fill(18 * 30 * 분)
		.map((v, k) => v + k * 55 * 분)
		.map((v) => `${parseHnM(v)}~${parseHnM(v + 50 * 분)}`),
] as const;

const ScheduleTable = memo(
	({ tableId, schedules, onScheduleTimeClick, onDeleteButtonClick }: Props) => {
		const getColor = useCallback(
			(lectureId: string): string => {
				const lectures = [...new Set(schedules.map(({ lecture }) => lecture.id))];
				const colors = ["#fdd", "#ffd", "#dff", "#ddf", "#fdf", "#dfd"];
				return colors[lectures.indexOf(lectureId) % colors.length];
			},
			[schedules]
		);

		const [activeTableId, setActiveTableId] = useState<string | null>(null);

		useDndMonitor({
			onDragStart(event) {
				const activeId = event.active.id;
				if (activeId) {
					setActiveTableId(String(activeId).split(":")[0]);
				}
			},
			onDragEnd() {
				setActiveTableId(null);
			},
			onDragCancel() {
				setActiveTableId(null);
			},
		});

		return (
			<Box
				position="relative"
				outline={activeTableId === tableId ? "5px dashed" : undefined}
				outlineColor="blue.300"
			>
				<Grid
					templateColumns={`120px repeat(${DAY_LABELS.length}, ${CellSize.WIDTH}px)`}
					templateRows={`40px repeat(${TIMES.length}, ${CellSize.HEIGHT}px)`}
					bg="white"
					fontSize="sm"
					textAlign="center"
					outline="1px solid"
					outlineColor="gray.300"
				>
					<GridItem key="교시" borderColor="gray.300" bg="gray.100">
						<Flex justifyContent="center" alignItems="center" h="full" w="full">
							<Text fontWeight="bold">교시</Text>
						</Flex>
					</GridItem>
					{DAY_LABELS.map((day) => (
						<DayItem key={day} day={day} />
					))}
					{TIMES.map((time, timeIndex) => (
						<TimeRow
							key={`시간-${timeIndex + 1}`}
							time={time}
							timeIndex={timeIndex}
							onScheduleTimeClick={onScheduleTimeClick}
						/>
					))}
				</Grid>

				{schedules.map((schedule, index) => (
					<DraggableSchedule
						key={`${schedule.lecture.title}-${index}`}
						id={`${tableId}:${index}`}
						data={schedule}
						bg={getColor(schedule.lecture.id)}
						onDeleteButtonClick={() =>
							onDeleteButtonClick?.({
								day: schedule.day,
								time: schedule.range[0],
							})
						}
					/>
				))}
			</Box>
		);
	}
);

export default ScheduleTable;
