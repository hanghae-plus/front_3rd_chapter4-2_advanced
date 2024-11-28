import {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { Schedule } from './types.ts';
import dummyScheduleMap from './dummyScheduleMap.ts';
import { CellSize, DAY_LABELS } from './constants.ts';
import { DragEndEvent } from '@dnd-kit/core';

interface ScheduleContextType {
  schedulesMap: Record<string, Schedule[]>;
  handleDuplicate: (targetId: string) => void;
  handleRemove: (targetId: string) => void;
  handleDelete: (targetId: string, day: string, time: number) => void;
  handleAddSchedule: (targetId: string, schedules: Schedule[]) => void;
  getSchedules: (tableId: string) => Schedule[];
  updateSchedule: (event: DragEndEvent) => void;
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

  const getSchedules = useCallback(
    (tableId: string) => {
      return schedulesMap[tableId] || [];
    },
    [schedulesMap]
  );

  const updateSchedule = useCallback((event: DragEndEvent) => {
    const { active, delta } = event;

    const { x, y } = delta;
    const [tableId, index] = (active.id as string).split(':');
    const moveDayIndex = Math.floor(x / CellSize.WIDTH);
    const moveTimeIndex = Math.floor(y / CellSize.HEIGHT);

    setSchedulesMap((prev) => {
      const schedule = prev[tableId][Number(index)];
      const nowDayIndex = DAY_LABELS.indexOf(schedule.day as (typeof DAY_LABELS)[number]);

      const updated = {
        ...schedule,
        day: DAY_LABELS[nowDayIndex + moveDayIndex],
        range: schedule.range.map((time) => time + moveTimeIndex),
      };

      const updatedSchedules = prev[tableId].map((targetSchedule, targetIndex) => {
        if (targetIndex !== Number(index)) {
          return targetSchedule;
        }
        return updated;
      });
      return {
        ...prev,
        [tableId]: updatedSchedules,
      };
    });
  }, []);

  const handleDuplicate = useCallback((targetId: string) => {
    setSchedulesMap((prev) => ({
      ...prev,
      [`schedule-${Date.now()}`]: [...prev[targetId]],
    }));
  }, []);

  const handleRemove = useCallback((targetId: string) => {
    setSchedulesMap((prev) => {
      delete prev[targetId];
      return { ...prev };
    });
  }, []);

  const handleDelete = useCallback((targetId: string, day: string, time: number) => {
    setSchedulesMap((prev) => ({
      ...prev,
      [targetId]: prev[targetId].filter(
        (schedule) => schedule.day !== day || !schedule.range.includes(time)
      ),
    }));
  }, []);

  const handleAddSchedule = useCallback((targetId: string, schedules: Schedule[]) => {
    setSchedulesMap((prev) => ({
      ...prev,
      [targetId]: [...prev[targetId], ...schedules],
    }));
  }, []);

  const value = useMemo(
    () => ({
      schedulesMap,
      handleDuplicate,
      handleRemove,
      handleDelete,
      handleAddSchedule,
      getSchedules,
      updateSchedule,
    }),
    [
      schedulesMap,
      handleDuplicate,
      handleRemove,
      handleDelete,
      handleAddSchedule,
      getSchedules,
      updateSchedule,
    ]
  );

  return <ScheduleContext.Provider value={value}>{children}</ScheduleContext.Provider>;
};
