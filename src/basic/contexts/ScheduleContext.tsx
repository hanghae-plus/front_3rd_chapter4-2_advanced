import { DragEndEvent } from '@dnd-kit/core';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from 'react';
import { DAY_LABELS } from '../constants/constants.ts';
import dummyScheduleMap from '../constants/dummyScheduleMap.ts';
import { Schedule } from '../types.ts';

export type DeleteSchedule = (
  tableId: string,
  { day, time }: { day: string; time: number },
) => void;

interface ScheduleContextType {
  schedulesMap: Record<string, Schedule[]>;
  getSchedules: (tableId: string) => Schedule[];

  duplicateSchedule: (targetId: string) => void;
  removeSchedule: (targetId: string) => void;

  addSchedule: (tableId: string, schedules: Schedule[]) => void;
  deleteSchedule: DeleteSchedule;
  updateSchedule: (event: DragEndEvent) => void;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(
  undefined,
);

export const useScheduleContext = () => {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
};

export const ScheduleProvider = ({ children }: PropsWithChildren) => {
  const [schedulesMap, setSchedulesMap] =
    useState<Record<string, Schedule[]>>(dummyScheduleMap);

  const getSchedules = useCallback(
    (tableId: string) => {
      return schedulesMap[tableId] || [];
    },
    [schedulesMap],
  );

  const duplicateSchedule = useCallback((targetId: string) => {
    setSchedulesMap(prev => ({
      ...prev,
      [`schedule-${Date.now()}`]: [...prev[targetId]],
    }));
  }, []);

  const removeSchedule = useCallback((targetId: string) => {
    setSchedulesMap(prev => {
      delete prev[targetId];
      return { ...prev };
    });
  }, []);

  const addSchedule = useCallback((tableId: string, schedules: Schedule[]) => {
    setSchedulesMap(prev => ({
      ...prev,
      [tableId]: [...prev[tableId], ...schedules],
    }));
  }, []);

  const updateSchedule = useCallback((event: DragEndEvent) => {
    const { active, delta } = event;
    const { x, y } = delta;
    const [tableId, scheduleIndex] = String(active.id).split(':');
    const targetIndex = Number(scheduleIndex);

    const CELL_WIDTH = 80;
    const CELL_HEIGHT = 30;
    const dayOffset = Math.floor(x / CELL_WIDTH);
    const timeOffset = Math.floor(y / CELL_HEIGHT);

    setSchedulesMap(prev => {
      const currentSchedule = prev[tableId][targetIndex];
      const currentDayIndex = DAY_LABELS.indexOf(
        currentSchedule.day as (typeof DAY_LABELS)[number],
      );
      const newDayIndex = currentDayIndex + dayOffset;

      if (prev[tableId] === undefined) return prev;

      return {
        ...prev,
        [tableId]: prev[tableId].map((schedule, index) => {
          if (index !== targetIndex) return schedule;

          return {
            ...schedule,
            day: DAY_LABELS[newDayIndex],
            range: schedule.range.map(time => time + timeOffset),
          };
        }),
      };
    });
  }, []);

  const deleteSchedule = useCallback(
    (tableId: string, { day, time }: { day: string; time: number }) =>
      setSchedulesMap(prev => ({
        ...prev,
        [tableId]: prev[tableId].filter(
          schedule => schedule.day !== day || !schedule.range.includes(time),
        ),
      })),
    [],
  );

  return (
    <ScheduleContext.Provider
      value={{
        schedulesMap,
        getSchedules,
        duplicateSchedule,
        removeSchedule,
        addSchedule,
        deleteSchedule,
        updateSchedule,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};
