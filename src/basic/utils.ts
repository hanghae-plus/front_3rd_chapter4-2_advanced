import { UniqueIdentifier } from '@dnd-kit/core';

export const fill2 = (n: number) => `0${n}`.substr(-2);

export const parseHnM = (current: number) => {
  const date = new Date(current);
  return `${fill2(date.getHours())}:${fill2(date.getMinutes())}`;
};

const getTimeRange = (value: string): number[] => {
  const [start, end] = value.split('~').map(Number);
  if (end === undefined) return [start];
  return Array(end - start + 1)
    .fill(start)
    .map((v, k) => v + k);
};

export const parseSchedule = (schedule: string) => {
  const schedules = schedule.split('<p>');
  return schedules.map(schedule => {
    const reg = /^([가-힣])(\d+(~\d+)?)(.*)/;

    const [day] = schedule.split(/(\d+)/);

    const range = getTimeRange(schedule.replace(reg, '$2'));

    const room = schedule.replace(reg, '$4')?.replace(/\(|\)/g, '');

    return { day, range, room };
  });
};

/**
 * 캐시된 결과를 사용하는 함수를 반환합니다.
 */
export const createCachedFetch = <T>(fetchFn: () => Promise<T>) => {
  let cache: T | null = null;
  let fetchPromise: Promise<T> | null = null;

  return () => {
    if (cache) {
      return Promise.resolve(cache);
    }

    if (fetchPromise) {
      return fetchPromise;
    }

    fetchPromise = fetchFn().then(result => {
      cache = result;
      fetchPromise = null;
      return result;
    });

    return fetchPromise;
  };
};

export const parseScheduleTableId = (activeId: UniqueIdentifier) => {
  const [tableId, index] = String(activeId).split(':');
  return { tableId, index: Number(index) };
};
