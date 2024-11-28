import { Box, Grid } from '@chakra-ui/react';
import { CellSize, DAY_LABELS } from "./constants.ts";
import { Schedule } from "./types.ts";
import { useDndContext } from "@dnd-kit/core";
import { Fragment, useMemo } from "react";
import { GridHeader } from '../schedule/ui/GridHeader.tsx';
import { TimeCell } from '../schedule/ui/TimeCell.tsx';
import { ScheduleCell } from '../schedule/ui/ScheduleCell.tsx';
import { DraggableSchedule } from '../schedule/ui/DraggableSchedule.tsx';
import { TIMES } from '../schedule/model/constants.ts';

interface Props {
  tableId: string;
  schedules: Schedule[];
  onScheduleTimeClick?: (timeInfo: { day: string, time: number }) => void;
  onDeleteButtonClick?: (timeInfo: { day: string, time: number }) => void;
}

const ScheduleTable = ({ tableId, schedules, onScheduleTimeClick, onDeleteButtonClick }: Props) => {


  const dndContext = useDndContext();

  // activeTableId 계산을 메모이제이션
  const activeTableId = useMemo(() => {
    const activeId = dndContext.active?.id;
    if (activeId) {
      return String(activeId).split(":")[0];
    }
    return null;
  }, [dndContext.active?.id]);  // active.id가 변경될 때만 재계산

  // 컬러 매핑을 Map으로 미리 계산
  const colorMap = useMemo(() => {
    const lectures = [...new Set(schedules.map(({ lecture }) => lecture.id))];
    const colors = ["#fdd", "#ffd", "#dff", "#ddf", "#fdf", "#dfd"];
    return new Map(
      lectures.map((id, index) => [id, colors[index % colors.length]])
    );
  }, [schedules]);

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
        <GridHeader />
        {TIMES.map((time, timeIndex) => (
          <Fragment key={`시간-${timeIndex + 1}`}>
            <TimeCell time={time} index={timeIndex} />
            {DAY_LABELS.map((day) => (
              <ScheduleCell
                key={`${day}-${timeIndex + 2}`}
                index={timeIndex}
                onClick={() => onScheduleTimeClick?.({ day, time: timeIndex + 1 })}
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
          bg={colorMap.get(schedule.lecture.id) || '#fff'}
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
