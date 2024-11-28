import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { DAY_LABELS } from "./constants.ts";
import dummyScheduleMap from "./dummyScheduleMap.ts";
import { Schedule } from "./types.ts";

interface ScheduleContextType {
  schedulesMap: Record<string, Schedule[]>;
  setSchedulesMap: React.Dispatch<
    React.SetStateAction<Record<string, Schedule[]>>
  >;
  duplicateSchedule: (targetId: string) => void;
  addSchedule: (tableId: string, schedules: Schedule[]) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateSchedule: (event: any) => void;
  removeSchedule: (tableId: string) => void;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(
  undefined
);

export const useScheduleContext = () => {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error("useSchedule must be used within a ScheduleProvider");
  }
  return context;
};

export const ScheduleProvider = ({ children }: PropsWithChildren) => {
  const [schedulesMap, setSchedulesMap] =
    useState<Record<string, Schedule[]>>(dummyScheduleMap);

  const duplicateSchedule = (targetId: string) => {
    setSchedulesMap((prev) => ({
      ...prev,
      [`schedule-${Date.now()}`]: [...prev[targetId]],
    }));
  };

  const addSchedule = useCallback((tableId: string, schedules: Schedule[]) => {
    setSchedulesMap((prev) => ({
      ...prev,
      [tableId]: [...prev[tableId], ...schedules],
    }));
  }, []);

  const updateSchedule = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (event: any) => {
      const { active, delta } = event;
      const { x, y } = delta;
      const [tableId, index] = active.id.split(":");
      const schedule = schedulesMap[tableId][index];
      const nowDayIndex = DAY_LABELS.indexOf(
        schedule.day as (typeof DAY_LABELS)[number]
      );
      const moveDayIndex = Math.floor(x / 80);
      const moveTimeIndex = Math.floor(y / 30);

      setSchedulesMap((prev) => ({
        ...prev,
        [tableId]: prev[tableId].map((targetSchedule, targetIndex) => {
          if (targetIndex !== Number(index)) {
            return targetSchedule; // 기존 참조 유지
          }
          return {
            ...targetSchedule,
            day: DAY_LABELS[nowDayIndex + moveDayIndex],
            range: targetSchedule.range.map((time) => time + moveTimeIndex),
          };
        }),
      }));
    },
    []
  );

  const removeSchedule = useCallback((tableId: string) => {
    setSchedulesMap((prev) => {
      delete prev[tableId];
      return { ...prev };
    });
  }, []);

  const value = useMemo(
    () => ({
      schedulesMap,
      setSchedulesMap,
      duplicateSchedule,
      addSchedule,
      updateSchedule,
      removeSchedule,
    }),
    [addSchedule, removeSchedule, schedulesMap, updateSchedule]
  );

  return (
    <ScheduleContext.Provider value={value}>
      {children}
    </ScheduleContext.Provider>
  );
};
