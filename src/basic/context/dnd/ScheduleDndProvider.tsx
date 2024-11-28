/* eslint-disable react-hooks/rules-of-hooks */
import { DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { PropsWithChildren, useCallback, useMemo } from "react";
import { DAY_LABELS } from "../../constants/index.ts";
import { useScheduleContext } from "../ScheduleContext.tsx";
import { createSnapModifier } from "./dndModifier.ts";

export default function ScheduleDndProvider({ children }: PropsWithChildren) {
  const { schedulesMap, setSchedulesMap } = useScheduleContext();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )
  const modifiers = useMemo(() => [createSnapModifier()], []);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = useCallback((event: any) => {
    const { active, delta } = event;
    const { x, y } = delta;
    const [tableId, index] = active.id.split(':');
    const schedule = schedulesMap[tableId][index];

    if (!schedule) return;

    const nowDayIndex = DAY_LABELS.indexOf(schedule.day as typeof DAY_LABELS[number])
    const moveDayIndex = Math.floor(x / 80);
    const moveTimeIndex = Math.floor(y / 30);

    setSchedulesMap({
      ...schedulesMap,
      [tableId]: schedulesMap[tableId].map((targetSchedule, targetIndex) => {
        if (targetIndex !== Number(index)) {
          return { ...targetSchedule }
        }
        return {
          ...targetSchedule,
          day: DAY_LABELS[nowDayIndex + moveDayIndex],
          range: targetSchedule.range.map(time => time + moveTimeIndex),
        }
      })
    })

  }, [schedulesMap, setSchedulesMap]);

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd} modifiers={modifiers}>
      {children}
    </DndContext>
  );
}