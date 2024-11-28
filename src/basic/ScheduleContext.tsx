import React, { createContext, PropsWithChildren, useContext, useCallback, useMemo } from 'react';
import { Schedule } from './types.ts';
import dummyScheduleMap from './dummyScheduleMap.ts';

interface TableContextType {
  tables: Record<string, Schedule[]>;
  updateSchedule: (tableId: string, scheduleIndex: number, updatedSchedule: Schedule) => void;
  updateTableSchedules: (tableId: string, schedules: Schedule[]) => void;
  duplicateTable: (tableId: string) => void;
  removeTable: (tableId: string) => void;
 }
 
 const ScheduleContext = createContext<TableContextType | undefined>(undefined);

 export const useScheduleContext = () => {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
 };
 

 export const useTableSchedule = (tableId: string) => {
  const { tables, updateSchedule, updateTableSchedules } = useScheduleContext();
  
  return React.useMemo(() => ({
    schedules: tables[tableId] || [],
    updateSchedule: (scheduleIndex: number, updatedSchedule: Schedule) => 
      updateSchedule(tableId, scheduleIndex, updatedSchedule),
    updateTableSchedules: (schedules: Schedule[]) => 
      updateTableSchedules(tableId, schedules)
  }), [tableId, tables[tableId], updateSchedule, updateTableSchedules]);
 };
 

 export const useTableIds = () => {
  const { tables, duplicateTable, removeTable } = useScheduleContext();
  
  return React.useMemo(() => ({
    tableIds: Object.keys(tables),
    duplicateTable,
    removeTable
  }), [tables, duplicateTable, removeTable]);
 };
 


 export const ScheduleProvider = ({ children }: PropsWithChildren) => {
  const tableData = useMemo(() => {
    return Object.entries(dummyScheduleMap).reduce((acc, [id, schedules]) => ({
      ...acc,
      [id]: schedules
    }), {});
  }, []);

  const [tables, setTables] = React.useState<Record<string, Schedule[]>>(tableData);

  const updateSchedule = useCallback((
    tableId: string, 
    scheduleIndex: number, 
    updatedSchedule: Schedule
  ) => {
    setTables(prev => {
      const tableSchedules = [...prev[tableId]];
      tableSchedules[scheduleIndex] = updatedSchedule;
      
      return {
        ...prev,
        [tableId]: tableSchedules
      };
    });
  }, []);



 const updateTableSchedules = useCallback((tableId: string, schedules: Schedule[]) => {
   setTables(prev => ({
     ...prev,
     [tableId]: schedules
   }));
 }, []);

 const duplicateTable = useCallback((tableId: string) => {
   setTables(prev => {
     const newId = `schedule-${Date.now()}`;
     return {
       ...prev,
       [newId]: [...prev[tableId]]
     };
   });
 }, []);


 const removeTable = useCallback((tableId: string) => {
  setTables(prev => {
    const { [tableId]: removed, ...rest } = prev;
    return rest;
  });
}, []);

const value = React.useMemo(() => ({
  tables,
  updateSchedule,
  updateTableSchedules,
  duplicateTable,
  removeTable
}), [tables, updateSchedule, updateTableSchedules, duplicateTable, removeTable]);

return (
  <ScheduleContext.Provider value={value}>
    {children}
  </ScheduleContext.Provider>
);
};