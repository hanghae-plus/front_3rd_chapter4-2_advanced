import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Text,
} from '@chakra-ui/react';
import { CellSize, DAY_LABELS, 분 } from "./constants.ts";
import { Schedule } from "./types.ts";
import { fill2, parseHnM } from "./utils.ts";
import { useDndContext, useDraggable } from "@dnd-kit/core";
import { CSS } from '@dnd-kit/utilities';
import { ComponentProps, Fragment, memo, useCallback, useMemo } from "react";

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

  const handleClickDayCell = useCallback((timeInfo: { day: string, time: number }) => {
    onScheduleTimeClick?.(timeInfo)
  }, [onScheduleTimeClick])

  const handleDeleteSchedule = useCallback((schedule: Schedule) => {
    onDeleteButtonClick?.({
      day: schedule.day,
      time: schedule.range[0],
    })
  }, [onDeleteButtonClick])

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
        <ScheduleTableHeader />
        
        {TIMES.map((time, timeIndex) => (
          <Fragment key={`시간-${timeIndex + 1}`}>
            <TimeCell 
              time={time}
              timeIndex={timeIndex}
            />

            {DAY_LABELS.map((day) => (
              <DayCell 
                key={`${day}-${timeIndex + 2}`}
                day={day}
                bg={timeIndex > 17 ? 'gray.100' : 'white'}
                timeIndex={timeIndex}
                onClick={handleClickDayCell}
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
          onDeleteButtonClick={handleDeleteSchedule}
        />
      ))}
    </Box>
  );
};

const DraggableSchedule = memo(({
 id,
 data,
 bg,
 onDeleteButtonClick
}: { id: string; data: Schedule } & ComponentProps<typeof Box> & {
  onDeleteButtonClick: (schedule: Schedule) => void
}) => {
  const { day, range, room, lecture } = data;
  const { attributes, setNodeRef, listeners, transform } = useDraggable({ id });
  const leftIndex = DAY_LABELS.indexOf(day as typeof DAY_LABELS[number]);
  const topIndex = range[0] - 1;
  const size = range.length;

  const handleClickDeleteButton = useCallback(() => {
    onDeleteButtonClick(data);
  }, [onDeleteButtonClick, data]);

  return (
    <Popover>
      <PopoverTrigger>
        <Box
          position="absolute"
          left={`${120 + (CellSize.WIDTH * leftIndex) + 1}px`}
          top={`${40 + (topIndex * CellSize.HEIGHT + 1)}px`}
          width={(CellSize.WIDTH - 1) + "px"}
          height={(CellSize.HEIGHT * size - 1) + "px"}
          bg={bg}
          p={1}
          boxSizing="border-box"
          cursor="pointer"
          ref={setNodeRef}
          transform={CSS.Translate.toString(transform)}
          {...listeners}
          {...attributes}
        >
          <Text fontSize="sm" fontWeight="bold">{lecture.title}</Text>
          <Text fontSize="xs">{room}</Text>
        </Box>
      </PopoverTrigger>
      <PopoverContent onClick={event => event.stopPropagation()}>
        <PopoverArrow/>
        <PopoverCloseButton/>
        <PopoverBody>
          <Text>강의를 삭제하시겠습니까?</Text>
          <Button colorScheme="red" size="xs" onClick={handleClickDeleteButton}>
            삭제
          </Button>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
})

DraggableSchedule.displayName = 'DraggableSchedule';

export default ScheduleTable;

// MEMO: props가 없는 컴포넌트도 부모 컴포넌트가 렌더링될 때 리렌더링되는 것을 방지하기 위해서 memo를 사용할 수 있음
const ScheduleTableHeader = memo(() => {
  return (
    <>
      <GridItem key="교시" borderColor="gray.300" bg="gray.100">
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
  )
})

ScheduleTableHeader.displayName = 'ScheduleTableHeader';

const TimeCell = memo(({ time, timeIndex } : { time: string; timeIndex: number }) => {
  return (
    <GridItem
      borderTop="1px solid"
      borderColor="gray.300"
      bg={timeIndex > 17 ? 'gray.200' : 'gray.100'}
    >
      <Flex justifyContent="center" alignItems="center" h="full">
        <Text fontSize="xs">{fill2(timeIndex + 1)} ({time})</Text>
      </Flex>
    </GridItem>
  )
})

TimeCell.displayName = 'TimeCell';

const DayCell = memo(({
  day,
  bg,
  timeIndex,
  onClick
}: {
  day: string;
  bg: string;
  timeIndex: number;
  onClick: (timeInfo: { day: string, time: number }) => void;
}) => {
  const hoverStyle = useMemo(() => ({
    bg: 'yellow.100'
  }), [])

  const handleClick = useCallback(() => {
    onClick({ day, time: timeIndex + 1 })
  }, [onClick, day, timeIndex]);

  return (
    <GridItem
      borderWidth="1px 0 0 1px"
      borderColor="gray.300"
      bg={bg}
      cursor="pointer"
      _hover={hoverStyle}
      onClick={handleClick}
    />
  )
})

DayCell.displayName = 'DayCell';