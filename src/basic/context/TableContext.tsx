import React, { createContext, PropsWithChildren, useContext } from 'react';
import { Schedule } from '../types';

interface TableContextType {
  schedules: Schedule[];
  updateSchedule: (scheduleIndex: number, updatedSchedule: Schedule) => void;
  updateTableSchedules: (schedules: Schedule[]) => void;
}

const TableContext = createContext<TableContextType | undefined>(undefined);

export const useTableContext = () => {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error('useTableContext must be used within TableProvider');
  }
  return context;
};

interface TableProviderProps extends PropsWithChildren {
  initialSchedules: Schedule[];
  onSchedulesChange?: (schedules: Schedule[]) => void;
}

export const TableProvider = ({ children, initialSchedules, onSchedulesChange }: TableProviderProps) => {
  const [schedules, setSchedules] = React.useState<Schedule[]>(initialSchedules);

  const updateSchedule = React.useCallback((scheduleIndex: number, updatedSchedule: Schedule) => {
    setSchedules(prev => {
      const newSchedules = [...prev];
      newSchedules[scheduleIndex] = updatedSchedule;
      onSchedulesChange?.(newSchedules);
      return newSchedules;
    });
  }, [onSchedulesChange]);

  const updateTableSchedules = React.useCallback((newSchedules: Schedule[]) => {
    setSchedules(newSchedules);
    onSchedulesChange?.(newSchedules);
  }, [onSchedulesChange]);

  const value = React.useMemo(() => ({
    schedules,
    updateSchedule,
    updateTableSchedules
  }), [schedules, updateSchedule, updateTableSchedules]);

  return (
    <TableContext.Provider value={value}>
      {children}
    </TableContext.Provider>
  );
};