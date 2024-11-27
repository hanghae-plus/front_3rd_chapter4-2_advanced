import {
  Box,
  Flex,
  Grid,
  GridItem,
  Text,
} from '@chakra-ui/react';
import { CellSize, DAY_LABELS, 분 } from "./constants.ts";
import { Schedule } from "./types.ts";
import { fill2, parseHnM } from "./utils.ts";
import { useDndContext, useDraggable } from "@dnd-kit/core";
import { CSS } from '@dnd-kit/utilities';
import { ComponentProps, Fragment, memo } from "react";

import { TimeColumn } from './TimeColumn';
import { DayHeaders } from './DayHeaders';
import { DraggableSchedule } from './DraggableSchedule';

interface Props {
  tableId: string;
  schedules: Schedule[];
  onScheduleTimeClick?: (timeInfo: { day: string, time: number }) => void;
  onDeleteButtonClick?: (timeInfo: { day: string, time: number }) => void;
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

const getColor = (lectureId: string, schedules: Schedule[]): string => {
  const lectures = [...new Set(schedules.map(({ lecture }) => lecture.id))];
  const colors = ["#fdd", "#ffd", "#dff", "#ddf", "#fdf", "#dfd"];
  return colors[lectures.indexOf(lectureId) % colors.length];
};

const ScheduleTable = memo(({ tableId, schedules, onScheduleTimeClick, onDeleteButtonClick }: Props) => {

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

        <DayHeaders />
        <TimeGrid onCellClick={onScheduleTimeClick} />

      </Grid>

      {schedules.map((schedule, index) => (
        <DraggableSchedule
          key={`${schedule.lecture.title}-${index}`}
          id={`${tableId}:${index}`}
          data={schedule}
          bg={getColor(schedule.lecture.id, schedules)}
          onDeleteButtonClick={() => onDeleteButtonClick?.({
            day: schedule.day,
            time: schedule.range[0],
          })}
        />
      ))}
    </Box>
  );
});

const DayHeaders = memo(() => (
  <>
    <GridItem borderColor="gray.300" bg="gray.100">
      <Flex justifyContent="center" alignItems="center" h="full" w="full">
        <Text fontWeight="bold">교시</Text>
      </Flex>
    </GridItem>
    {DAY_LABELS.map((day) => (
      <GridItem key={day} borderLeft="1px" borderColor="gray.300" bg="gray.100">
        <Flex justifyContent="center" alignItems="center" h="full">
          <Text fontWeight="bold">{day}</Text>
        </Flex>
      </GridItem>
    ))}
  </>
));


const TimeGrid = memo(({ onCellClick }: { onCellClick?: Props['onScheduleTimeClick'] }) => {
  return (
    <>
      {TIMES.map((time, timeIndex) => (
        <Fragment key={`grid-${timeIndex}`}>
          <GridItem
            borderTop="1px solid"
            borderColor="gray.300"
            bg={timeIndex > 17 ? 'gray.200' : 'gray.100'}
          >
            <Flex justifyContent="center" alignItems="center" h="full">
              <Text fontSize="xs">{fill2(timeIndex + 1)} ({time})</Text>
            </Flex>
          </GridItem>

          {DAY_LABELS.map((day) => (
            <GridItem
              key={`${day}-${timeIndex}`}
              borderWidth="1px 0 0 1px"
              borderColor="gray.300"
              bg={timeIndex > 17 ? 'gray.100' : 'white'}
              cursor="pointer"
              _hover={{ bg: 'yellow.100' }}
              onClick={() => onCellClick?.({ day, time: timeIndex + 1 })}
            />
          ))}
        </Fragment>
      ))}
    </>
  );
});

export default ScheduleTable;
