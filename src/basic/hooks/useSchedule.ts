import { useAtom, useSetAtom } from 'jotai';
import { tableIdsAtom, scheduleAtomFamily, duplicateTableAtom, removeTableAtom } from '../atoms/scheduleAtoms';
import { Schedule } from '../types';

export const useTableIds = () => {
    const [tableIds] = useAtom(tableIdsAtom);
    const duplicateTable = useSetAtom(duplicateTableAtom);
    const removeTable = useSetAtom(removeTableAtom);
  
    return {
      tableIds,
      duplicateTable,
      removeTable
    };
  };
  

  export const useSchedule = (tableId: string) => {
    const [schedules, setSchedules] = useAtom(scheduleAtomFamily(tableId));
  
    return {
      schedules,
      updateSchedules: setSchedules,
    };
  };
  
  export const useScheduleManagement = () => {
    const updateSchedules = useSetAtom(scheduleAtomFamily(""));  // Initial empty string will be overwritten
  
    return {
      addSchedulesToTable: ({ tableId, schedules: newSchedules }: { tableId: string; schedules: Schedule[] }) => {
        const atomForTable = scheduleAtomFamily(tableId);
        const setSchedulesForTable = useSetAtom(atomForTable);
        
        setSchedulesForTable((prev) => [...prev, ...newSchedules]);
      }
    };
  };