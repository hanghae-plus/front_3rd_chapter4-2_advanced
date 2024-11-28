// import { PropsWithChildren } from 'react';
import { Schedule } from '../types';
import { TableProvider } from '../context/TableContext';
import { useScheduleContext } from '../context/ScheduleContext';

export interface TableScheduleProviderProps {
  tableId: string;
  children: React.ReactNode;
}

export const TableScheduleProvider = ({ tableId, children }: TableScheduleProviderProps) => {
  const { tables, updateTableSchedules } = useScheduleContext();
  
  return (
    <TableProvider 
      initialSchedules={tables[tableId] || []}
      onSchedulesChange={(schedules: Schedule[]) => updateTableSchedules(tableId, schedules)}
    >
      {children}
    </TableProvider>
  );
};