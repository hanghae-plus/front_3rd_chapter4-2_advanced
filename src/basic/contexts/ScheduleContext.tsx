import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react';
import { Schedule } from '../types.ts';
import dummyScheduleMap from '../dummyScheduleMap.ts';

interface ScheduleContextType {
  schedulesMap: Record<string, Schedule[]>;
  setSchedulesMap: Dispatch<SetStateAction<Record<string, Schedule[]>>>;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const useScheduleContext = () => {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error('useScheduleContext must be used within a ScheduleProvider');
  }


  return context;
};

export const ScheduleProvider = ({ children }: PropsWithChildren) => {
  const [schedulesMap, setSchedulesMap] =
      useState<Record<string, Schedule[]>>(dummyScheduleMap);

  return (
      <ScheduleContext.Provider value={{ schedulesMap, setSchedulesMap }}>
        {children}
      </ScheduleContext.Provider>
  );
};

export const useSchedule = (tableId: string) => {
  const context = useContext(ScheduleContext);
  if (!context) throw new Error('useSchedule must be used within ScheduleProvider');

  const schedules = useMemo(() => context.schedulesMap[tableId], [context, tableId]);

  const deleteSchedule = useCallback((tableId: string, day: string, time: number) => {
    context.setSchedulesMap(prev => ({
      ...prev,
      [tableId]: prev[tableId].filter(schedule => schedule.day !== day || !schedule.range.includes(time))
    }));
  }, [context]);

  return useMemo(() => ({
    schedules,
    deleteSchedule,
  }), [schedules, deleteSchedule]);
};