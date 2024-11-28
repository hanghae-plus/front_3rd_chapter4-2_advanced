import {
  Box,
  Popover,
  PopoverTrigger,
  Text,
} from '@chakra-ui/react';
import { ComponentProps, memo, useMemo } from "react";
import { Schedule } from "../../basic/types";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from '@dnd-kit/utilities';
import { CellSize, DAY_LABELS } from "../../basic/constants";
import { ScheduleDeletePopoverContent } from './ScheduleDeletePopoverContent';

export const DraggableSchedule = memo(({
  id,
  data,
  bg,
  onDeleteButtonClick
 }: { id: string; data: Schedule } & ComponentProps<typeof Box> & {
   onDeleteButtonClick: () => void
 }) => {
   const { day, range, room, lecture } = data;
   const { attributes, setNodeRef, listeners, transform } = useDraggable({ id });

   const styles = useMemo(() => {
    const leftIndex = DAY_LABELS.indexOf(day as typeof DAY_LABELS[number]);
    const topIndex = range[0] - 1;
    const size = range.length;

    return {
      position: 'absolute',
      left: `${120 + (CellSize.WIDTH * leftIndex) + 1}px`,
      top: `${40 + (topIndex * CellSize.HEIGHT + 1)}px`,
      width: `${CellSize.WIDTH - 1}px`,
      height: `${CellSize.HEIGHT * size - 1}px`,
      bg,
      p: 1,
      boxSizing: 'border-box',
      cursor: 'pointer',
      transform: CSS.Translate.toString(transform)
    } as const;
  }, [day, range, bg, transform]);
 
   return (
     <Popover>
       <PopoverTrigger>
         <Box
           ref={setNodeRef}
           {...styles}
           {...listeners}
           {...attributes}
         >
           <Text fontSize="sm" fontWeight="bold">{lecture.title}</Text>
           <Text fontSize="xs">{room}</Text>
         </Box>
       </PopoverTrigger>
       <ScheduleDeletePopoverContent onDeleteButtonClick={onDeleteButtonClick} />
     </Popover>
   );
 });