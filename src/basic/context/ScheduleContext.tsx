import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from "react";
import { Schedule } from "../types/index.ts";
import dummyScheduleMap from "../dummyScheduleMap.ts";

interface ScheduleContextType {
  schedulesMap: Record<string, Schedule[]>;
  setSchedulesMap: React.Dispatch<
    React.SetStateAction<Record<string, Schedule[]>>
  >;
}

export const ScheduleContext = createContext<ScheduleContextType | undefined>(
  undefined
);

export const useScheduleContext = () => {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error("useSchedule must be used within a ScheduleProvider");
  }
  return context;
};

export function useTableSchedules(tableId: string) {
  const context = useContext(ScheduleContext);
  if (!context) throw new Error("ScheduleContext not found");

  return useMemo(
    () => ({
      schedules: context.schedulesMap[tableId],
      updateSchedules: (updater: (schedules: Schedule[]) => Schedule[]) => {
        context.setSchedulesMap((prev) => ({
          ...prev,
          [tableId]: updater(prev[tableId]),
        }));
      },
    }),
    [context, tableId]
  );
}

export const ScheduleProvider = ({ children }: PropsWithChildren) => {
  const [schedulesMap, setSchedulesMap] =
    useState<Record<string, Schedule[]>>(dummyScheduleMap);

  return (
    <ScheduleContext.Provider value={{ schedulesMap, setSchedulesMap }}>
      {children}
    </ScheduleContext.Provider>
  );
};
