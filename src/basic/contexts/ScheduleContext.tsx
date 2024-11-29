import { DragEndEvent } from '@dnd-kit/core';
import React, {
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
  setSchedulesMap: React.Dispatch<
    React.SetStateAction<Record<string, Schedule[]>>
  >;
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
    const [tableId, index] = String(active.id).split(':');

    const moveDayIndex = Math.floor(x / 80);
    const moveTimeIndex = Math.floor(y / 30);

    setSchedulesMap(prev => {
      const schedule = prev[tableId][Number(index)];
      const nowDayIndex = DAY_LABELS.indexOf(
        schedule.day as (typeof DAY_LABELS)[number],
      );

      return {
        ...prev,
        [tableId]: prev[tableId].map((targetSchedule, targetIndex) => {
          if (targetIndex !== Number(index)) {
            return { ...targetSchedule };
          }

          return {
            ...targetSchedule,
            day: DAY_LABELS[nowDayIndex + moveDayIndex],
            range: targetSchedule.range.map(time => time + moveTimeIndex),
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
        setSchedulesMap,
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
