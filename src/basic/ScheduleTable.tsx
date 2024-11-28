import { memo, useMemo, useCallback } from "react";
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
import { CellSize, DAY_LABELS, 분 } from "./constants.ts";
import { Schedule } from "./types.ts";
import { fill2, parseHnM } from "./utils.ts";
import { useDndContext, useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Fragment } from "react";

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

const TableGrid = memo(
  ({
    onScheduleTimeClick,
  }: {
    onScheduleTimeClick?: (timeInfo: { day: string; time: number }) => void;
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
        <GridItem key="교시" borderColor="gray.300" bg="gray.100">
          <Flex justifyContent="center" alignItems="center" h="full" w="full">
            <Text fontWeight="bold">교시</Text>
          </Flex>
        </GridItem>
        {DAY_LABELS.map((day) => (
          <GridItem
            key={day}
            borderLeft="1px"
            borderColor="gray.300"
            bg="gray.100"
          >
            <Flex justifyContent="center" alignItems="center" h="full">
              <Text fontWeight="bold">{day}</Text>
            </Flex>
          </GridItem>
        ))}
        {TIMES.map((time, timeIndex) => (
          <Fragment key={`시간-${timeIndex + 1}`}>
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
            {DAY_LABELS.map((day) => (
              <GridItem
                key={`${day}-${timeIndex + 2}`}
                borderWidth="1px 0 0 1px"
                borderColor="gray.300"
                bg={timeIndex > 17 ? "gray.100" : "white"}
                cursor="pointer"
                _hover={{ bg: "yellow.100" }}
                onClick={() =>
                  onScheduleTimeClick?.({ day, time: timeIndex + 1 })
                }
              />
            ))}
          </Fragment>
        ))}
      </Grid>
    );
  }
);

TableGrid.displayName = "TableGrid";

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
    const { attributes, setNodeRef, listeners, transform } = useDraggable({
      id,
    });
    const { active } = useDndContext();

    const style = useMemo(
      () => ({
        position: "absolute" as const,
        left: `${
          120 +
          CellSize.WIDTH *
            DAY_LABELS.indexOf(data.day as (typeof DAY_LABELS)[number]) +
          1
        }px`,
        top: `${40 + ((data.range[0] - 1) * CellSize.HEIGHT + 1)}px`,
        width: CellSize.WIDTH - 1 + "px",
        height: CellSize.HEIGHT * data.range.length - 1 + "px",
        transform: CSS.Translate.toString(transform),
        opacity: active?.id === id ? 0.5 : 1,
      }),
      [data.day, data.range, transform, active?.id, id]
    );

    return (
      <Popover>
        <PopoverTrigger>
          <Box
            {...style}
            bg={bg}
            p={1}
            boxSizing="border-box"
            cursor="pointer"
            ref={setNodeRef}
            {...listeners}
            {...attributes}
          >
            <Text fontSize="sm" fontWeight="bold">
              {data.lecture.title}
            </Text>
            <Text fontSize="xs">{data.room}</Text>
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

DraggableSchedule.displayName = "DraggableSchedule";

const DragContainer = memo(
  ({ tableId, children }: { tableId: string; children: React.ReactNode }) => {
    const { active } = useDndContext();
    const isActive = active?.id
      ? String(active.id).split(":")[0] === tableId
      : false;

    return (
      <Box
        position="relative"
        outline={isActive ? "5px dashed" : undefined}
        outlineColor="blue.300"
      >
        {children}
      </Box>
    );
  }
);

DragContainer.displayName = "DragContainer";

const ScheduleTable = memo(
  ({ tableId, schedules, onScheduleTimeClick, onDeleteButtonClick }: Props) => {
    const colorMap = useMemo(() => {
      const lectures = [...new Set(schedules.map(({ lecture }) => lecture.id))];
      const colors = ["#fdd", "#ffd", "#dff", "#ddf", "#fdf", "#dfd"];
      return new Map(
        lectures.map((id, index) => [id, colors[index % colors.length]])
      );
    }, [schedules]);

    const getColor = useCallback(
      (lectureId: string) => colorMap.get(lectureId) || "#ddd",
      [colorMap]
    );
    const handleDeleteClick = useCallback(
      (schedule: Schedule) => {
        onDeleteButtonClick?.({
          day: schedule.day,
          time: schedule.range[0],
        });
      },
      [onDeleteButtonClick]
    );

    return (
      <DragContainer tableId={tableId}>
        <TableGrid onScheduleTimeClick={onScheduleTimeClick} />
        {schedules.map((schedule, index) => (
          <DraggableSchedule
            key={`${schedule.lecture.title}-${index}`}
            id={`${tableId}:${index}`}
            data={schedule}
            bg={getColor(schedule.lecture.id)}
            onDeleteButtonClick={() => handleDeleteClick(schedule)}
          />
        ))}
      </DragContainer>
    );
  }
);

ScheduleTable.displayName = "ScheduleTable";

export default ScheduleTable;
