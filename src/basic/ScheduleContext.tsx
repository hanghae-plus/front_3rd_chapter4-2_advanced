import React, { createContext, PropsWithChildren, useContext, useCallback } from 'react';
import { Schedule, TableSchedule } from './types.ts';
import dummyScheduleMap from './dummyScheduleMap.ts';

interface ScheduleContextType {
  tables: TableSchedule[];
  updateTableSchedules: (tableId: string, schedules: Schedule[]) => void;
  duplicateTable: (tableId: string) => void;
  removeTable: (tableId: string) => void;
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
  const [tables, setTables] = React.useState<TableSchedule[]>(() => 
    Object.entries(dummyScheduleMap).map(([id, schedules]) => ({
      id,
      schedules
    }))
  );

  const updateTableSchedules = useCallback((tableId: string, schedules: Schedule[]) => {
    setTables(prev => 
      prev.map(table => 
        table.id === tableId ? { ...table, schedules } : table
      )
    );
  }, []);

  const duplicateTable = useCallback((tableId: string) => {
    setTables(prev => {
      const tableToClone = prev.find(table => table.id === tableId);
      if (!tableToClone) return prev;
      
      return [...prev, {
        id: `schedule-${Date.now()}`,
        schedules: [...tableToClone.schedules]
      }];
    });
  }, []);

  const removeTable = useCallback((tableId: string) => {
    setTables(prev => prev.filter(table => table.id !== tableId));
  }, []);

  const value = React.useMemo(() => ({
    tables,
    updateTableSchedules,
    duplicateTable,
    removeTable
  }), [tables, updateTableSchedules, duplicateTable, removeTable]);

  return (
    <ScheduleContext.Provider value={value}>
      {children}
    </ScheduleContext.Provider>
  );
};
