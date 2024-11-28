import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";
import { Schedule } from "./types.ts";
import dummyScheduleMap from "./dummyScheduleMap.ts";

interface ScheduleContextType {
  schedulesMap: Record<string, Schedule[]>;
  setSchedulesMap: React.Dispatch<
    React.SetStateAction<Record<string, Schedule[]>>
  >;
  updateSchedule: (id: string, updatedSchedule: Schedule) => void;
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

  // 메모이제이션을 통해 schedulesMap이 변경되지 않으면 다시 계산하지 않음
  const memoizedSchedulesMap = useMemo(() => schedulesMap, [schedulesMap]);

  // 스케줄을 업데이트하는 함수 (스케줄 ID별로 업데이트)
  const updateSchedule = useCallback(
    (id: string, updatedSchedule: Schedule) => {
      setSchedulesMap((prevSchedulesMap) => {
        const newSchedulesMap = { ...prevSchedulesMap };
        const updatedSchedules =
          newSchedulesMap[id]?.map((schedule) =>
            schedule.id === updatedSchedule.id ? updatedSchedule : schedule
          ) || [];
        newSchedulesMap[id] = updatedSchedules;
        return newSchedulesMap;
      });
    },
    []
  );

  return (
    <ScheduleContext.Provider
      value={{
        schedulesMap: memoizedSchedulesMap,
        setSchedulesMap,
        updateSchedule,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};
