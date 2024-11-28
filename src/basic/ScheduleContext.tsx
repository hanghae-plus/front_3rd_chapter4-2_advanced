import React, { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react';
import { Schedule } from './types.ts';
import dummyScheduleMap from './dummyScheduleMap.ts';
import { DragEndEvent } from '@dnd-kit/core';
import { CellSize, DAY_LABELS } from './constants.ts';

interface ScheduleContextType {
  schedulesMap: Record<string, Schedule[]>;
  duplicateSchedules: (targetId: string) => void;
  removeSchedules: (targetId: string) => void;
  deleteSchedule: (targetId: string, day: string, time: number) => void;
  addSchedules: (targetId: string, schedules: Schedule[]) => void;
  getSchedules: (targetId: string) => Schedule[];
  updateSchedules: (event: DragEndEvent) => void;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const useScheduleContext = () => {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
};

export const ScheduleProvider = ({ children }: PropsWithChildren) => {
  const [schedulesMap, setSchedulesMap] = useState<Record<string, Schedule[]>>(dummyScheduleMap);

  const duplicateSchedules = useCallback((targetId: string) => {
    setSchedulesMap((prev) => ({
      ...prev,
      [`schedule-${Date.now()}`]: [...prev[targetId]]
    }));
  }, []);
  
  const removeSchedules = useCallback((targetId: string) => {
    setSchedulesMap(prev => {
      delete prev[targetId];
      return { ...prev };
    });
  }, []);

  const deleteSchedule = useCallback((targetId: string, day: string, time: number) => {
    setSchedulesMap((prev) => ({
      ...prev,
      [targetId]: prev[targetId].filter(schedule => 
        schedule.day !== day || !schedule.range.includes(time)
      )
    }));
  }, []);

  const addSchedules = useCallback((targetId: string, schedules: Schedule[]) => {
    setSchedulesMap((prev) => ({
      ...prev,
      [targetId]: [...prev[targetId], ...schedules]
    }));
  }, []);

  const getSchedules = useCallback((targetId: string) => schedulesMap[targetId] || [], [schedulesMap]);

  const updateSchedules = useCallback((event: DragEndEvent) => {
    const { active, delta } = event;

    const { x, y } = delta;
    const [tableId, index] = (active.id as string).split(":");
    const moveDayIndex = Math.floor(x / CellSize.WIDTH);
    const moveTimeIndex = Math.floor(y / CellSize.HEIGHT);

    setSchedulesMap((prev) => {
      const schedule = prev[tableId][Number(index)];
      const nowDayIndex = DAY_LABELS.indexOf(
        schedule.day as (typeof DAY_LABELS)[number]
      );

      const updated = {
        ...schedule,
        day: DAY_LABELS[nowDayIndex + moveDayIndex],
        range: schedule.range.map((time) => time + moveTimeIndex),
      };

      const updatedSchedules = prev[tableId].map(
        (targetSchedule, targetIndex) => {
          if (targetIndex !== Number(index)) {
            return targetSchedule;
          }
          return updated;
        }
      );
      return {
        ...prev,
        [tableId]: updatedSchedules,
      };
    });
  }, []);

  const value = useMemo(() => ({
    schedulesMap,
    duplicateSchedules,
    removeSchedules,
    deleteSchedule,
    addSchedules,
    getSchedules,
    updateSchedules,
  }), [
    schedulesMap,
    duplicateSchedules,
    removeSchedules,
    deleteSchedule,
    addSchedules,
    getSchedules,
    updateSchedules
  ]);

  return (
    <ScheduleContext.Provider value={value}>
      {children}
    </ScheduleContext.Provider>
  );
};
