import { DndContext, Modifier, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { PropsWithChildren, useCallback } from "react";
import { CellSize, DAY_LABELS } from "./constants.ts";
import { useTableSchedule } from "./ScheduleContext.tsx";


interface DndProviderProps extends PropsWithChildren {
  tableId: string;
 }


function createSnapModifier(): Modifier {
 return ({ transform, containerNodeRect, draggingNodeRect }) => {
   const containerTop = containerNodeRect?.top ?? 0;
   const containerLeft = containerNodeRect?.left ?? 0;
   const containerBottom = containerNodeRect?.bottom ?? 0;
   const containerRight = containerNodeRect?.right ?? 0;

   const { top = 0, left = 0, bottom = 0, right = 0 } = draggingNodeRect ?? {};

   const minX = containerLeft - left + 120 + 1;
   const minY = containerTop - top + 40 + 1;
   const maxX = containerRight - right;
   const maxY = containerBottom - bottom;

   return ({
     ...transform,
     x: Math.min(Math.max(Math.round(transform.x / CellSize.WIDTH) * CellSize.WIDTH, minX), maxX),
     y: Math.min(Math.max(Math.round(transform.y / CellSize.HEIGHT) * CellSize.HEIGHT, minY), maxY),
   });
 };
}


const modifiers = [createSnapModifier()];

export default function ScheduleDndProvider({ children, tableId }: DndProviderProps) {
  const { schedules, updateSchedule } = useTableSchedule(tableId);
 
 const sensors = useSensors(
   useSensor(PointerSensor, {
     activationConstraint: {
       distance: 8,
     },
   })
 );

 
 const handleDragEnd = useCallback((event: any) => {
  console.log('DragEnd 이벤트 발생:', event);

  const { active, delta } = event;
  if (!active || !delta) {
    console.warn('DragEnd 무효 이벤트:', { active, delta });
    return;
  }

  const { x, y } = delta;
  const [, index] = active.id.split(':');
  const scheduleIndex = Number(index);

  if (isNaN(scheduleIndex)) {
    console.warn('유효하지 않은 인덱스 변환:', { index });
    return;
  }

  console.log('DragEnd 정보:', {
    activeId: active.id,
    schedules,
    tableId,
    // tableIdFromId,
  });


  const schedule = schedules[scheduleIndex];
  if (!schedule) {
    console.warn('유효하지 않은 스케줄 인덱스:', scheduleIndex);
    return;
  }

  const nowDayIndex = DAY_LABELS.indexOf(schedule.day as typeof DAY_LABELS[number]);
  const moveDayIndex = Math.floor(x / CellSize.WIDTH);
  const moveTimeIndex = Math.floor(y / CellSize.HEIGHT);

  const newDayIndex = nowDayIndex + moveDayIndex;
  if (newDayIndex < 0 || newDayIndex >= DAY_LABELS.length) {
    console.warn('유효하지 않은 날짜 인덱스:', newDayIndex);
    return;
  }

  const newDay = DAY_LABELS[newDayIndex];
  const newRange = schedule.range.map(time => time + moveTimeIndex);


  console.log('변경 검사:', {
    newDay,
    scheduleDay: schedule.day,
    newRange,
    scheduleRange: schedule.range,
  });


   // 변경사항이 없으면 업데이트하지 않음
   if (newDay === schedule.day && 
    newRange.length === schedule.range.length && 
    newRange.every((time, i) => time === schedule.range[i])) {
      console.log('변경 사항 없음');
  return;
}

  // 업데이트 호출 시 명확한 값 전달
  const updatedSchedule = {
    ...schedule,
    day: newDay,
    range: newRange,
  };

  console.log('업데이트 호출 준비:', { scheduleIndex, updatedSchedule });

  updateSchedule(scheduleIndex, updatedSchedule);

  console.log('업데이트 호출 완료');
}, [schedules, updateSchedule]);

return (
  <DndContext 
    sensors={sensors} 
    onDragEnd={handleDragEnd} 
    modifiers={modifiers}
  >
    {children}
  </DndContext>
);
}