import { Box } from '@chakra-ui/react';
import { useDndContext } from '@dnd-kit/core';
import { memo, useMemo } from 'react';
import { DeleteSchedule } from '../../contexts/ScheduleContext.tsx';
import { Schedule } from '../../types.ts';
import { DraggableSchedule } from './DraggableSchedule.tsx';
import { ScheduleTableGrid } from './ScheduleTableGrid.tsx';

type ContainerProps = {
  tableId: string;
  children: React.ReactNode;
};

export const Container = ({ tableId, children }: ContainerProps) => {
  const dndContext = useDndContext();
  const activeTableId = useMemo(() => {
    const activeId = dndContext.active?.id;
    if (activeId) {
      return String(activeId).split(':')[0];
    }
    return null;
  }, [dndContext.active]);

  return (
    <Box
      position="relative"
      outline={activeTableId === tableId ? '5px dashed' : undefined}
      outlineColor="blue.300"
    >
      {children}
    </Box>
  );
};

interface Props {
  tableId: string;
  schedules: Schedule[];
  onScheduleTimeClick?: (timeInfo: { day: string; time: number }) => void;
  onDeleteButtonClick?: DeleteSchedule;
}

const ScheduleTable = memo(
  ({ tableId, schedules, onScheduleTimeClick, onDeleteButtonClick }: Props) => {
    const getColor = (lectureId: string): string => {
      const lectures = [...new Set(schedules.map(({ lecture }) => lecture.id))];
      const colors = ['#fdd', '#ffd', '#dff', '#ddf', '#fdf', '#dfd'];
      return colors[lectures.indexOf(lectureId) % colors.length];
    };

    return (
      <Container tableId={tableId}>
        <ScheduleTableGrid onScheduleTimeClick={onScheduleTimeClick} />

        {schedules.map((schedule, index) => (
          <DraggableSchedule
            key={`${schedule.lecture.title}-${index}`}
            id={`${tableId}:${index}`}
            data={schedule}
            bg={getColor(schedule.lecture.id)}
            onDeleteButtonClick={() =>
              onDeleteButtonClick?.(tableId, {
                day: schedule.day,
                time: schedule.range[0],
              })
            }
          />
        ))}
      </Container>
    );
  },
);

export default ScheduleTable;
