import { Box, Popover, PopoverTrigger, Text } from '@chakra-ui/react';
import { ComponentProps, memo, useState, useEffect } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

import { CellSize, DAY_LABELS } from '../constants.ts';
import { Schedule } from '../types.ts';
import DeleteConfirmationModal from './DeleteConfirmationModal.tsx';

const DragLectureBlock = memo(function DragLectureBlock({
  id,
  data,
  bg,
  onDeleteButtonClick,
}: { id: string; data: Schedule } & ComponentProps<typeof Box> & {
    onDeleteButtonClick: () => void;
  }) {
  const { day, range, room, lecture } = data;
  const { attributes, setNodeRef, listeners, transform } = useDraggable({ id });
  const leftIndex = DAY_LABELS.indexOf(day as (typeof DAY_LABELS)[number]);
  const topIndex = range[0] - 1;
  const size = range.length;

  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setIsDragging(!!transform);
  }, [transform]);

  return (
    <Popover>
      <PopoverTrigger>
        <Box
          position="absolute"
          left={`${120 + CellSize.WIDTH * leftIndex + 1}px`}
          top={`${40 + (topIndex * CellSize.HEIGHT + 1)}px`}
          width={`${CellSize.WIDTH - 1}px`}
          height={`${CellSize.HEIGHT * size - 1}px`}
          bg={bg}
          p={1}
          boxSizing="border-box"
          cursor="pointer"
          ref={setNodeRef}
          transform={CSS.Translate.toString(transform)}
          transition={isDragging ? 'none' : 'transform 0.2s ease'}
          {...listeners}
          {...attributes}
        >
          <Text fontSize="sm" fontWeight="bold">
            {lecture.title}
          </Text>
          <Text fontSize="xs">{room}</Text>
        </Box>
      </PopoverTrigger>
      <DeleteConfirmationModal onDelete={onDeleteButtonClick} />
    </Popover>
  );
});

export default DragLectureBlock;
