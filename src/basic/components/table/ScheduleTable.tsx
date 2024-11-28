import { Box } from "@chakra-ui/react";
import { COLORS, Schedule } from "../../types";
import { useDndContext } from "@dnd-kit/core";
import { memo, useCallback, useMemo } from "react";
import { DraggableSchedule } from "./DraggableSchedule";
import { TableGrid } from "./TableGrid";

interface Props {
  tableId: string;
  schedules: Schedule[];
  onScheduleTimeClick?: (timeInfo: { day: string; time: number }) => void;
  onDeleteButtonClick?: (timeInfo: { day: string; time: number }) => void;
}

interface ScheduleItemsProps {
  schedules: Schedule[];
  tableId: string;
  onDeleteButtonClick?: (timeInfo: { day: string; time: number }) => void;
}

const ScheduleItems = memo(
  ({ schedules, tableId, onDeleteButtonClick }: ScheduleItemsProps) => {
    const getColor = useCallback(
      (lectureId: string): string => {
        const lectures = [
          ...new Set(schedules.map(({ lecture }) => lecture.id)),
        ];
        return COLORS[lectures.indexOf(lectureId) % COLORS.length];
      },
      [schedules]
    );

    return (
      <>
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
      </>
    );
  }
);

const ScheduleTable = memo(
  ({ tableId, schedules, onScheduleTimeClick, onDeleteButtonClick }: Props) => {
    const dndContext = useDndContext();
    const isActiveTable = useMemo(() => {
      const activeId = dndContext.active?.id;
      return activeId ? String(activeId).split(":")[0] === tableId : false;
    }, [dndContext.active?.id, tableId]);

    return (
      <Box
        position="relative"
        outline={isActiveTable ? "5px dashed" : undefined}
        outlineColor="blue.300"
      >
        <TableGrid onScheduleTimeClick={onScheduleTimeClick} />
        <ScheduleItems
          schedules={schedules}
          tableId={tableId}
          onDeleteButtonClick={onDeleteButtonClick}
        />
      </Box>
    );
  }
);

export default ScheduleTable;
