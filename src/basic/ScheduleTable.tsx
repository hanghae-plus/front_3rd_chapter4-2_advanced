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
import { useDndContext } from "@dnd-kit/core";
import React, { Fragment, memo, useMemo } from "react";

import { DraggableSchedule } from './DraggableSchedule';
import { useSchedule } from './hooks/useSchedule';

import { TableScheduleProvider } from './provider/TableScheduleProvider';
import ScheduleDndProvider from './provider/ScheduleDndProvider';

interface Props {
  tableId: string;
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
 


 const ScheduleTableContent = memo(({ tableId, onScheduleTimeClick, onDeleteButtonClick }: Props) => {
  const { schedules } = useSchedule(tableId);
  const dndContext = useDndContext();

  const activeTableId = useMemo(() => {
    const activeId = dndContext.active?.id;
    if (activeId) {
      return String(activeId).split(":")[0];
    }
    return null;
  }, [dndContext.active?.id]);

  const getColor = useMemo(() => {
    const colors = ["#fdd", "#ffd", "#dff", "#ddf", "#fdf", "#dfd"];
    const lectures = [...new Set(schedules.map(({ lecture }) => lecture.id))];
    return (lectureId: string) => colors[lectures.indexOf(lectureId) % colors.length];
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
        <DayHeaders />
        <TimeGrid onCellClick={onScheduleTimeClick} />
      </Grid>

      <ScheduleItems
        schedules={schedules}
        tableId={tableId}
        getColor={getColor}
        onDeleteButtonClick={onDeleteButtonClick}
      />
    </Box>
    
  );
 });


 const ScheduleItems = memo(({ 
  schedules, 
  tableId,
  getColor, 
  onDeleteButtonClick 
 }: {
  schedules: Schedule[];
  tableId: string;
  getColor: (lectureId: string) => string;
  onDeleteButtonClick?: Props['onDeleteButtonClick'];
 }) => (
  
  <>
    {schedules.map((schedule, index) => (
      <DraggableSchedule
        key={`${schedule.lecture.id}-${index}`}
        id={`${tableId}:${index}`}
        data={schedule}
        bg={getColor(schedule.lecture.id)}
        onDeleteButtonClick={() => onDeleteButtonClick?.({
          day: schedule.day,
          time: schedule.range[0],
        })}
      />
    ))}
  </>

 ));
 

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


const ScheduleTable = memo(({ tableId, ...props }: Props) => {
  return (
    <TableScheduleProvider tableId={tableId}>
      <ScheduleDndProvider tableId={tableId}> 
        <ScheduleTableContent tableId={tableId} {...props} />
      </ScheduleDndProvider>
    </TableScheduleProvider>
  );
});
 
 export default ScheduleTable;