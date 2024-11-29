import { Box } from '@chakra-ui/react';
import { Schedule } from '../type/types';
import { useDndContext } from '@dnd-kit/core';
import DraggableSchedule from './schedule-table/DraggableSchedule';
import ScheduleTableGrid from './schedule-table/ScheduleTableGrid';
import ScheduleDndProvider from '../context/ScheduleDndProvider';
import { useState } from 'react';

interface Props {
  tableId: string;
  schedules: Schedule[];
  onScheduleTimeClick?: (timeInfo: { day: string; time: number }) => void;
  onDeleteButtonClick?: (timeInfo: { day: string; time: number }) => void;
}

const ScheduleTable = ({ tableId, onScheduleTimeClick, onDeleteButtonClick, schedules }: Props) => {
  const [oneOfSchedules, setOneOfSchedules] = useState<Schedule[]>(schedules);

  const getColor = (lectureId: string): string => {
    const lectures = [...new Set(oneOfSchedules.map(({ lecture }) => lecture.id))];
    const colors = ['#fdd', '#ffd', '#dff', '#ddf', '#fdf', '#dfd'];
    return colors[lectures.indexOf(lectureId) % colors.length];
  };

  const dndContext = useDndContext();

  const getActiveTableId = () => {
    const activeId = dndContext.active?.id;
    if (activeId) {
      return String(activeId).split(':')[0];
    }
    return null;
  };

  const updateSchedules = (newSchedules: Schedule[]) => {
    setOneOfSchedules([...newSchedules]);
  };

  const activeTableId = getActiveTableId();

  return (
    <ScheduleDndProvider
      tableId={tableId}
      schedules={oneOfSchedules}
      updateSchedules={updateSchedules}
    >
      <Box
        position="relative"
        outline={activeTableId === tableId ? '5px dashed' : undefined}
        outlineColor="blue.300"
      >
        <ScheduleTableGrid handleScheduleTimeClick={onScheduleTimeClick} />
        {oneOfSchedules.map((schedule, index) => (
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
    </ScheduleDndProvider>
  );
};

export default ScheduleTable;
