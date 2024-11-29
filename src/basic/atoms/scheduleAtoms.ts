import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { Schedule } from '../types';
import dummyScheduleMap from '../dummyScheduleMap';

// dummyScheduleMap의 타입 정의
type ScheduleMap = {
    [key: string]: Schedule[];
  };
  
  // 타입 단언을 사용하여 dummyScheduleMap의 타입을 명시
  const typedScheduleMap = dummyScheduleMap as ScheduleMap;

  
// 시간표 ID 목록을 관리하는 atom
export const tableIdsAtom = atom<string[]>(Object.keys(typedScheduleMap));

// 각 시간표의 일정을 관리하는 atomFamily
export const scheduleAtomFamily = atomFamily((tableId: string) => 
  atom<Schedule[]>(typedScheduleMap[tableId] || [])
);

// 시간표 추가/삭제 등의 작업을 위한 유틸리티 atom들
export const duplicateTableAtom = atom(
    null, // read 없음
    (get, set, tableId: string) => {
      const sourceSchedules = get(scheduleAtomFamily(tableId));
      const newId = `schedule-${Date.now()}`;
      
      // 새로운 시간표의 atom 생성
      set(scheduleAtomFamily(newId), [...sourceSchedules]);
      
      // ID 목록에 새 시간표 추가
      const currentIds = get(tableIdsAtom);
      set(tableIdsAtom, [...currentIds, newId]);
    }
  );

  export const removeTableAtom = atom(
    null,
    (get, set, tableId: string) => {
      const currentIds = get(tableIdsAtom);
      set(tableIdsAtom, currentIds.filter(id => id !== tableId));
    }
  );

  
  export const addSchedulesToTableAtom = atom(
    null,
    (get, set, { tableId, schedules }: { tableId: string, schedules: Schedule[] }) => {
      const tableSchedules = get(scheduleAtomFamily(tableId));
      set(scheduleAtomFamily(tableId), [...tableSchedules, ...schedules]);
    }
  );