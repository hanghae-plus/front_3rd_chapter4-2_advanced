import { memo, useCallback, useMemo } from "react";
import {
  Box,
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Text,
} from '@chakra-ui/react';
import { useDraggable } from "@dnd-kit/core";
import { CSS } from '@dnd-kit/utilities';
import { CellSize, DAY_LABELS } from "./constants.ts";
import { Schedule } from "./types.ts";

interface DraggableScheduleProps {
  id: string;
  data: Schedule;
  bg: string;
  onDeleteButtonClick: () => void;
}

const DraggableSchedule = memo(({
  id,
  data,
  bg,
  onDeleteButtonClick,
  ...boxProps
}: DraggableScheduleProps) => {
  const { day, range, room, lecture } = data;
  const { attributes, setNodeRef, listeners, transform } = useDraggable({ id });

  const leftIndex = useMemo(() => DAY_LABELS.indexOf(day as typeof DAY_LABELS[number]), [day]);
  const topIndex = useMemo(() => range[0] - 1, [range]);
  const size = useMemo(() => range.length, [range]);

  const handleDelete = useCallback(() => {
    onDeleteButtonClick();
  }, [onDeleteButtonClick]);

  return (
    <Popover>
      <PopoverTrigger>
        <Box
          position="absolute"
          left={`${120 + (CellSize.WIDTH * leftIndex) + 1}px`}
          top={`${40 + (topIndex * CellSize.HEIGHT + 1)}px`}
          width={`${CellSize.WIDTH - 1}px`}
          height={`${CellSize.HEIGHT * size - 1}px`}
          bg={bg}
          p={1}
          boxSizing="border-box"
          cursor="pointer"
          ref={setNodeRef}
          transform={CSS.Translate.toString(transform)}
          {...listeners}
          {...attributes}
          {...boxProps}
        >
          <Text fontSize="sm" fontWeight="bold">{lecture.title}</Text>
          <Text fontSize="xs">{room}</Text>
        </Box>
      </PopoverTrigger>
      <PopoverContent onClick={(event) => event.stopPropagation()}>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>
          <Text>강의를 삭제하시겠습니까?</Text>
          <Button colorScheme="red" size="xs" onClick={handleDelete}>
            삭제
          </Button>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
});

export default DraggableSchedule;
