import { useCallback, useMemo } from 'react';
import { useScheduleContext } from './ScheduleContext';
import { Schedule } from './types';

export const useTableSchedule = (tableId: string) => {
  const { tables, updateTableSchedules } = useScheduleContext();
  
  const schedules = useMemo(() => 
    tables.find(table => table.id === tableId)?.schedules || [],
    [tables, tableId]
  );

  const updateSchedules = useCallback((newSchedules: Schedule[]) => {
    updateTableSchedules(tableId, newSchedules);
  }, [tableId, updateTableSchedules]);

  return { schedules, updateSchedules };
};