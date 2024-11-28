import {GridItem} from "@chakra-ui/react";
import {memo} from "react";

interface Props {
    day: "월" | "화" | "수" | "목" | "금" | "토";
    timeIndex: number;
    onScheduleTimeClick: (timeInfo: { day: string, time: number }) => void
}

const TimeSlot = memo(({ day, timeIndex, onScheduleTimeClick }: Props) => (
    <GridItem
        borderWidth="1px 0 0 1px"
        borderColor="gray.300"
        bg={timeIndex > 17 ? 'gray.100' : 'white'}
        cursor="pointer"
        _hover={{ bg: 'yellow.100' }}
        onClick={() => onScheduleTimeClick?.({ day, time: timeIndex + 1 })}
    />
));

export default TimeSlot;