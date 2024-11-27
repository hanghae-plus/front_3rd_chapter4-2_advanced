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
} from "@chakra-ui/react";
import { CellSize, DAY_LABELS, 분 } from "./constants";
import { Schedule } from "./types";
import { fill2, parseHnM } from "./utils";
import { useDndContext, useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Fragment, memo, useCallback, useMemo } from "react";

interface Props {
  tableId: string;
  schedules: Schedule[];
  onScheduleTimeClick?: (timeInfo: { day: string; time: number }) => void;
  onDeleteButtonClick?: (timeInfo: { day: string; time: number }) => void;
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

const COLORS = ["#fdd", "#ffd", "#dff", "#ddf", "#fdf", "#dfd"] as const;

const TimeCell = memo(
  ({ time, timeIndex }: { time: string; timeIndex: number }) => (
    <GridItem
      borderTop="1px solid"
      borderColor="gray.300"
      bg={timeIndex > 17 ? "gray.200" : "gray.100"}
    >
      <Flex justifyContent="center" alignItems="center" h="full">
        <Text fontSize="xs">
          {fill2(timeIndex + 1)} ({time})
        </Text>
      </Flex>
    </GridItem>
  )
);

const DayCell = memo(
  ({
    day,
    timeIndex,
    onScheduleTimeClick,
  }: {
    day: string;
    timeIndex: number;
    onScheduleTimeClick?: (info: { day: string; time: number }) => void;
  }) => (
    <GridItem
      borderWidth="1px 0 0 1px"
      borderColor="gray.300"
      bg={timeIndex > 17 ? "gray.100" : "white"}
      cursor="pointer"
      _hover={{ bg: "yellow.100" }}
      onClick={() => onScheduleTimeClick?.({ day, time: timeIndex + 1 })}
    />
  )
);

const DraggableSchedule = memo(
  ({
    id,
    data,
    bg,
    onDeleteButtonClick,
  }: {
    id: string;
    data: Schedule;
    bg: string;
    onDeleteButtonClick: () => void;
  }) => {
    const { day, range, room, lecture } = data;
    const { attributes, setNodeRef, listeners, transform } = useDraggable({
      id,
    });
    const leftIndex = DAY_LABELS.indexOf(day as (typeof DAY_LABELS)[number]);
    const topIndex = range[0] - 1;
    const size = range.length;

    return (
      <Popover>
        <PopoverTrigger>
          <Box
            position="absolute"
            left={`${120 + CellSize.WIDTH * leftIndex + 1}px`}
            top={`${40 + (topIndex * CellSize.HEIGHT + 1)}px`}
            width={CellSize.WIDTH - 1 + "px"}
            height={CellSize.HEIGHT * size - 1 + "px"}
            bg={bg}
            p={1}
            boxSizing="border-box"
            cursor="pointer"
            ref={setNodeRef}
            transform={CSS.Translate.toString(transform)}
            {...listeners}
            {...attributes}
          >
            <Text fontSize="sm" fontWeight="bold">
              {lecture.title}
            </Text>
            <Text fontSize="xs">{room}</Text>
          </Box>
        </PopoverTrigger>
        <PopoverContent onClick={(event) => event.stopPropagation()}>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverBody>
            <Text>강의를 삭제하시겠습니까?</Text>
            <Button colorScheme="red" size="xs" onClick={onDeleteButtonClick}>
              삭제
            </Button>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    );
  }
);

const HeaderCell = memo(({ day }: { day: string }) => (
  <GridItem borderLeft="1px" borderColor="gray.300" bg="gray.100">
    <Flex justifyContent="center" alignItems="center" h="full">
      <Text fontWeight="bold">{day}</Text>
    </Flex>
  </GridItem>
));

const TableHeader = memo(() => (
  <>
    <GridItem key="교시" borderColor="gray.300" bg="gray.100">
      <Flex justifyContent="center" alignItems="center" h="full" w="full">
        <Text fontWeight="bold">교시</Text>
      </Flex>
    </GridItem>
    {DAY_LABELS.map((day) => (
      <HeaderCell key={day} day={day} />
    ))}
  </>
));

const TableGrid = memo(
  ({
    onScheduleTimeClick,
  }: {
    onScheduleTimeClick?: (info: { day: string; time: number }) => void;
  }) => {
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
            <TimeCell time={time} timeIndex={timeIndex} />
            {DAY_LABELS.map((day) => (
              <DayCell
                key={`${day}-${timeIndex + 2}`}
                day={day}
                timeIndex={timeIndex}
                onScheduleTimeClick={onScheduleTimeClick}
              />
            ))}
          </Fragment>
        ))}
      </Grid>
    );
  }
);

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
