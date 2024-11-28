import {
  Box,
  Grid,
} from '@chakra-ui/react';
import { CellSize, DAY_LABELS, 분 } from "../../constants.ts";
import { Schedule } from "../../types.ts";
import { parseHnM } from "../../utils.ts";
import { useDndContext } from "@dnd-kit/core";
import { Fragment } from "react";
import DraggableSchedule from "./DraggableSchedule.tsx";
import TimeSlot from "./TimeSlot.tsx";
import TableHeader from "./TableHeader.tsx";
import TimeColumn from "./TimeColumn.tsx";

interface Props {
  tableId: string;
  schedules: Schedule[];
  onScheduleTimeClick: (timeInfo: { day: string, time: number }) => void;
  onDeleteButtonClick: (timeInfo: { day: string, time: number }) => void;
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

const ScheduleTable = ({ tableId, schedules, onScheduleTimeClick, onDeleteButtonClick }: Props) => {

  const getColor = (lectureId: string): string => {
    const lectures = [...new Set(schedules.map(({ lecture }) => lecture.id))];
    const colors = ["#fdd", "#ffd", "#dff", "#ddf", "#fdf", "#dfd"];
    return colors[lectures.indexOf(lectureId) % colors.length];
  };

  const dndContext = useDndContext();

  const getActiveTableId = () => {
    const activeId = dndContext.active?.id;
    if (activeId) {
      return String(activeId).split(":")[0];
    }
    return null;
  }

  const activeTableId = getActiveTableId();

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

      {schedules.map((schedule, index) => (
        <DraggableSchedule
          key={`${schedule.lecture.title}-${index}`}
          id={`${tableId}:${index}`}
          data={schedule}
          bg={getColor(schedule.lecture.id)}
          onDeleteButtonClick={() => onDeleteButtonClick?.({
            day: schedule.day,
            time: schedule.range[0],
          })}
        />
      ))}
    </Box>
  );
};

export default ScheduleTable;
