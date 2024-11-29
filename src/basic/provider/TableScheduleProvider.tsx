// import { PropsWithChildren } from 'react';
import { Schedule } from '../types';
import { TableProvider } from '../context/TableContext';
// import { useScheduleContext } from '../context/ScheduleContext';
import { useSchedule } from '../hooks/useSchedule';

export interface TableScheduleProviderProps {
  tableId: string;
  children: React.ReactNode;
}

export const TableScheduleProvider = ({ tableId, children }: TableScheduleProviderProps) => {
  const { schedules, updateSchedules } = useSchedule(tableId);
  
  return (
    <TableProvider 
      initialSchedules={schedules}
      onSchedulesChange={updateSchedules}
    >
      {children}
    </TableProvider>
  );
};