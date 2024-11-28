import React, { createContext, PropsWithChildren, useContext } from 'react';
import dummyScheduleMap from '../dummyScheduleMap';
import { Schedule } from '../types';
// import { useTableContext } from './TableContext';

interface ScheduleContextType {
  tables: Record<string, Schedule[]>;
  tableIds: string[];
  duplicateTable: (tableId: string) => void;
  removeTable: (tableId: string) => void;
  setSchedulesMap: React.Dispatch<React.SetStateAction<Record<string, Schedule[]>>>;
  updateTableSchedules: (tableId: string, schedules: Schedule[]) => void;  
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const useScheduleContext = () => {
  const context = useContext(ScheduleContext);
  if (!context) {
    throw new Error('useScheduleContext must be used within ScheduleProvider');
  }
  return context;
};


export const useTableIds = () => {
  const { tableIds, duplicateTable, removeTable } = useScheduleContext();
  return { tableIds, duplicateTable, removeTable };
};

export const useTableSchedule = (tableId: string) => {
  const { tables, setSchedulesMap } = useScheduleContext();
  
  return React.useMemo(() => ({
    schedules: tables[tableId] || [],
    updateTableSchedules: (schedules: Schedule[]) => {
      setSchedulesMap(prev => ({
        ...prev,
        [tableId]: schedules
      }));
    }
  }), [tableId, tables, setSchedulesMap]);
};


export const ScheduleProvider = ({ children }: PropsWithChildren) => {

  const [tables, setTables] = React.useState<Record<string, Schedule[]>>(() => 
    Object.entries(dummyScheduleMap).reduce((acc, [id, schedules]) => ({
      ...acc,
      [id]: schedules
    }), {} as Record<string, Schedule[]>)
  );


  const tableIds = React.useMemo(() => Object.keys(tables), [tables]);

  const updateTableSchedules = React.useCallback((tableId: string, schedules: Schedule[]) => {
    console.log('Updating schedules for table:', tableId, schedules);
    setTables(prev => {
      const updated = {
        ...prev,
        [tableId]: schedules
      };
      console.log('New state:', updated);
      return updated;
    });
  }, []);


  const duplicateTable = React.useCallback((tableId: string) => {
    setTables(prev => {
      const newId = `schedule-${Date.now()}`;
      return {
        ...prev,
        [newId]: [...prev[tableId]]
      };
    });
  }, []);

  const removeTable = React.useCallback((tableId: string) => {
    setTables(prev => {
      const { [tableId]: _, ...rest } = prev;  // removed를 _로 변경
      return rest;
    });
  }, []);

  const value = React.useMemo(() => ({
    tables,
    tableIds,
    duplicateTable,
    removeTable,
    setSchedulesMap: setTables,
    updateTableSchedules // value에 추가
  }), [tables, tableIds, duplicateTable, removeTable, updateTableSchedules]);

  return (
    <ScheduleContext.Provider value={value}>
      {children}
    </ScheduleContext.Provider>
  );
};