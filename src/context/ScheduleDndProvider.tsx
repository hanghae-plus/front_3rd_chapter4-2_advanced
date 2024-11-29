import { DndContext, Modifier, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { PropsWithChildren } from 'react';
import { CellSize, DAY_LABELS } from '../constant/constants.ts';
import { Schedule } from '../type/types.ts';

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
      y: Math.min(
        Math.max(Math.round(transform.y / CellSize.HEIGHT) * CellSize.HEIGHT, minY),
        maxY
      ),
    };
  };
}

const modifiers = [createSnapModifier()];

interface ScheduleDndProviderProps extends PropsWithChildren {
  tableId: string;
  schedules: Schedule[];
  updateSchedules: (schedules: Schedule[]) => void;
}

export type DayLabel = (typeof DAY_LABELS)[number];

export default function ScheduleDndProvider({
  tableId,
  schedules,
  updateSchedules,
  children,
}: ScheduleDndProviderProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (event: any) => {
    const { active, delta } = event;
    const { x, y } = delta;
    const [draggedTableId, index] = active.id.split(':');

    if (draggedTableId !== tableId) return;

    const nowDayIndex = DAY_LABELS.indexOf(schedules[Number(index)].day as DayLabel);
    const moveDayIndex = Math.floor(x / CellSize.WIDTH);
    const moveTimeIndex = Math.floor(y / CellSize.HEIGHT);

    const updatedSchedules = schedules.map((schedule, idx) => {
      if (idx !== Number(index)) return schedule;

      return {
        ...schedule,
        day: DAY_LABELS[nowDayIndex + moveDayIndex],
        range: schedule.range.map((time) => time + moveTimeIndex),
      };
    });

    updateSchedules(updatedSchedules);
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd} modifiers={modifiers}>
      {children}
    </DndContext>
  );
}
