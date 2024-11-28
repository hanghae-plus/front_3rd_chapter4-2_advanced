import {CellSize, DAY_LABELS, 분} from "../../constants.ts";
import TableHeader from "./TableHeader.tsx";
import {Fragment, memo} from "react";
import TimeColumn from "./TimeColumn.tsx";
import TimeSlot from "./TimeSlot.tsx";
import {Grid} from "@chakra-ui/react";
import {parseHnM} from "../../utils.ts";

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

interface Props {
    onScheduleTimeClick: (timeInfo: { day: string, time: number }) => void;
}

const TableGrid = memo(({onScheduleTimeClick}:Props) => {
    return (
        <Grid
            templateColumns={`120px repeat(${DAY_LABELS.length}, ${CellSize.WIDTH}px)`}
            templateRows={`40px repeat(${TIMES.length}, ${CellSize.HEIGHT}px)`}
            bg="white"
            fontSize="sm"
            textAlign="center"
            outline="1px solid"
            outlineColor="gray.300"
        >
            <TableHeader />
            {TIMES.map((time, timeIndex) => (
                <Fragment key={`시간-${timeIndex + 1}`}>
                    <TimeColumn time={time} timeIndex={timeIndex} />
                    {DAY_LABELS.map((day) => (
                        <TimeSlot
                            key={`${day}-${timeIndex + 2}`}
                            day={day}
                            timeIndex={timeIndex}
                            onScheduleTimeClick={onScheduleTimeClick}
                        />
                    ))}
                </Fragment>
            ))}
        </Grid>
    )
});

export default TableGrid;