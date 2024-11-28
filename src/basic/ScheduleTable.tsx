import { Box } from '@chakra-ui/react';
import { Schedule } from './types.ts';

import { memo } from 'react';
import { useScheduleContext } from './ScheduleContext';
import DragLectureBlock from './components/DragLectureBlock';
import { TimeTable } from './components/TimeTable';

interface Props {
  tableId: string;
  schedules: Schedule[];
  activeDragTableId: string | null;
  onScheduleTimeClick?: (timeInfo: { day: string; time: number }) => void;
}

const getColor = (schedules: Schedule[], lectureId: string): string => {
  const lectures = [...new Set(schedules.map(({ lecture }) => lecture.id))];
  const colors = ['#fdd', '#ffd', '#dff', '#ddf', '#fdf', '#dfd'];
  return colors[lectures.indexOf(lectureId) % colors.length];
};

export const ScheduleTable = memo(function ScheduleTable({
  tableId,
  activeDragTableId,
  onScheduleTimeClick,
  schedules,
}: Props) {
  const { handleDelete } = useScheduleContext();

  return (
    <Box
      position="relative"
      outline={activeDragTableId === tableId ? '5px dashed' : undefined}
      outlineColor="blue.300"
    >
      <TimeTable onScheduleTimeClick={onScheduleTimeClick} />

      {schedules.map((schedule, index) => (
        <DragLectureBlock
          key={`${schedule.lecture.title}-${index}`}
          id={`${tableId}:${index}`}
          data={schedule}
          bg={getColor(schedules, schedule.lecture.id)}
          onDeleteButtonClick={() => handleDelete?.(tableId, schedule.day, schedule.range[0])}
        />
      ))}
    </Box>
  );
});
