import { Flex, GridItem, Text } from "@chakra-ui/react";
import { memo, useMemo } from "react";
import { fill2 } from "../../basic/utils";
import { DAY_LABELS } from "../../basic/constants";

interface Props {
	time: string;
	timeIndex: number;
	onScheduleTimeClick?: (timeInfo: { day: string; time: number }) => void;
}

const TimeRow = memo(({ time, timeIndex, onScheduleTimeClick }: Props) => {
	return (
		<>
			<GridItem
				borderTop="1px solid"
				borderColor="gray.300"
				bg={timeIndex > 17 ? "gray.200" : "gray.100"}
			>
				<Flex justifyContent="center" alignItems="center" h="full">
					<Text fontSize="xs">
						{fill2(timeIndex + 1)} ({time})
					</Text>
				</Flex>
			</GridItem>
			{DAY_LABELS.map((day) => (
				<BlockItem
					key={`${day}-${timeIndex + 2}`}
					day={day}
					timeIndex={timeIndex}
					onScheduleTimeClick={onScheduleTimeClick}
				/>
			))}
		</>
	);
});

const BlockItem = ({
	day,
	timeIndex,
	onScheduleTimeClick,
}: {
	day: string;
	timeIndex: number;
	onScheduleTimeClick?: (timeInfo: { day: string; time: number }) => void;
}) => {
	const handleClick = useMemo(
		() => () => onScheduleTimeClick?.({ day, time: timeIndex + 1 }),
		[day, timeIndex, onScheduleTimeClick]
	);

	return (
		<GridItem
			borderWidth="1px 0 0 1px"
			borderColor="gray.300"
			bg={timeIndex > 17 ? "gray.100" : "white"}
			cursor="pointer"
			_hover={{ bg: "yellow.100" }}
			onClick={handleClick}
		/>
	);
};

export default TimeRow;
