import { DndContext, Modifier, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import React, { PropsWithChildren } from "react";
import { CellSize, DAY_LABELS } from "../constants";
// import { useScheduleContext } from "../context/ScheduleContext";
import { useSchedule } from '../hooks/useSchedule';

interface Props extends PropsWithChildren {
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

    return {
      ...transform,
      x: Math.min(Math.max(Math.round(transform.x / CellSize.WIDTH) * CellSize.WIDTH, minX), maxX),
      y: Math.min(Math.max(Math.round(transform.y / CellSize.HEIGHT) * CellSize.HEIGHT, minY), maxY),
    };
  };
}



const modifiers = [createSnapModifier()];

export default function ScheduleDndProvider({ tableId, children }: Props) {
  const { schedules, updateSchedules } = useSchedule(tableId);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );
 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = React.useCallback((event: any) => {
    const { active, delta } = event;
    if (!active || !delta) return;

    const { x, y } = delta;
    const scheduleIndex = Number(active.id.split(':')[1]);
    if (isNaN(scheduleIndex)) return;


    const schedule = schedules[scheduleIndex];
    if (!schedule) return;

    const nowDayIndex = DAY_LABELS.indexOf(schedule.day as typeof DAY_LABELS[number]);
    const moveDayIndex = Math.round(x / CellSize.WIDTH);
    const moveTimeIndex = Math.round(y / CellSize.HEIGHT);

    
    const newDayIndex = nowDayIndex + moveDayIndex;
    if (newDayIndex < 0 || newDayIndex >= DAY_LABELS.length) return;

    const newDay = DAY_LABELS[newDayIndex];
    const newRange = schedule.range.map(time => time + moveTimeIndex);

    if (
      newDay === schedule.day && 
      newRange.length === schedule.range.length && 
      newRange.every((time, i) => time === schedule.range[i])
    ) return;

    const updatedSchedule = {
      ...schedule,
      day: newDay,
      range: newRange,
    };

    const newSchedules = [...schedules];
    newSchedules[scheduleIndex] = updatedSchedule;
    updateSchedules(newSchedules);
  }, [schedules, updateSchedules]);
  
  
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