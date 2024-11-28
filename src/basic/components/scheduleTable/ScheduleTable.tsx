import {
  Box,
} from '@chakra-ui/react';
import { Schedule } from "../../types.ts";
import { useDndMonitor} from "@dnd-kit/core";
import {memo, useCallback, useState} from "react";
import DraggableSchedule from "./DraggableSchedule.tsx";
import TableGrid from "./TableGrid.tsx";

interface Props {
  tableId: string;
  schedules: Schedule[];
  onScheduleTimeClick: (timeInfo: { day: string, time: number }) => void;
  onDeleteButtonClick: (timeInfo: { day: string, time: number }) => void;
}

const ScheduleTable = memo(({ tableId, schedules, onScheduleTimeClick, onDeleteButtonClick }: Props) => {

  const getColor = useCallback((lectureId: string): string => {
    const lectures = [...new Set(schedules.map(({ lecture }) => lecture.id))];
    const colors = ["#fdd", "#ffd", "#dff", "#ddf", "#fdf", "#dfd"];
    return colors[lectures.indexOf(lectureId) % colors.length];
  }, [schedules]);

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
      <TableGrid onScheduleTimeClick={onScheduleTimeClick} />
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
});

export default ScheduleTable;
