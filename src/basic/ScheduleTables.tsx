import { Button, ButtonGroup, Flex, Heading, Stack } from "@chakra-ui/react";
import { memo, useCallback, useMemo } from "react";
import ScheduleTable from "./ScheduleTable.tsx";
import { useScheduleContext } from "./ScheduleContext.tsx";
import SearchDialog from "./SearchDialog.tsx";
import { useState } from "react";
import { Schedule } from "./types.ts";

// 개별 시간표 컴포넌트 분리
const TimeTable = memo(({ 
  tableId, 
  schedules, 
  index, 
  disabledRemoveButton,
  onSearchClick,
  onDuplicate,
  onRemove,
  onScheduleTimeClick,
  onDeleteSchedule
}: {
  tableId: string;
  schedules: Schedule[];
  index: number;
  disabledRemoveButton: boolean;
  onSearchClick: (tableId: string) => void;
  onDuplicate: (tableId: string) => void;
  onRemove: (tableId: string) => void;
  onScheduleTimeClick: (tableId: string, timeInfo: { day: string; time: number }) => void;
  onDeleteSchedule: (tableId: string, info: { day: string; time: number }) => void;
}) => (
  <Stack width="600px">
    <Flex justifyContent="space-between" alignItems="center">
      <Heading as="h3" fontSize="lg">시간표 {index + 1}</Heading>
      <ButtonGroup size="sm" isAttached>
        <Button 
          colorScheme="green" 
          onClick={() => onSearchClick(tableId)}
        >
          시간표 추가
        </Button>
        <Button 
          colorScheme="green" 
          mx="1px" 
          onClick={() => onDuplicate(tableId)}
        >
          복제
        </Button>
        <Button 
          colorScheme="green" 
          isDisabled={disabledRemoveButton}
          onClick={() => onRemove(tableId)}
        >
          삭제
        </Button>
      </ButtonGroup>
    </Flex>
    <ScheduleTable
      key={`schedule-table-${index}`}
      schedules={schedules}
      tableId={tableId}
      onScheduleTimeClick={(timeInfo) => onScheduleTimeClick(tableId, timeInfo)}
      onDeleteButtonClick={(timeInfo) => onDeleteSchedule(tableId, timeInfo)}
    />
  </Stack>
));

export const ScheduleTables = () => {
  const { schedulesMap, setSchedulesMap } = useScheduleContext();
  const [searchInfo, setSearchInfo] = useState<{
    tableId: string;
    day?: string;
    time?: number;
  } | null>(null);

  const disabledRemoveButton = useMemo(() => 
    Object.keys(schedulesMap).length === 1,
    [schedulesMap]
  );

  // 이벤트 핸들러들 메모이제이션
  const handleDuplicate = useCallback((targetId: string) => {
    setSchedulesMap(prev => ({
      ...prev,
      [`schedule-${Date.now()}`]: [...prev[targetId]]
    }));
  }, [setSchedulesMap]);

  const handleRemove = useCallback((targetId: string) => {
    setSchedulesMap(prev => {
      const newMap = { ...prev };
      delete newMap[targetId];
      return newMap;
    });
  }, [setSchedulesMap]);

  const handleSearchClick = useCallback((tableId: string) => {
    setSearchInfo({ tableId });
  }, []);

  const handleScheduleTimeClick = useCallback((tableId: string, timeInfo: { day: string; time: number }) => {
    setSearchInfo({ tableId, ...timeInfo });
  }, []);

  const handleDeleteSchedule = useCallback((tableId: string, { day, time }: { day: string; time: number }) => {
    setSchedulesMap((prev) => ({
      ...prev,
      [tableId]: prev[tableId].filter(
        schedule => schedule.day !== day || !schedule.range.includes(time)
      )
    }));
  }, [setSchedulesMap]);

  const handleCloseSearch = useCallback(() => {
    setSearchInfo(null);
  }, []);

  // 시간표 목록을 메모이제이션
  const timeTableList = useMemo(() => 
    Object.entries(schedulesMap).map(([tableId, schedules], index) => (
      <TimeTable
        key={tableId}
        tableId={tableId}
        schedules={schedules}
        index={index}
        disabledRemoveButton={disabledRemoveButton}
        onSearchClick={handleSearchClick}
        onDuplicate={handleDuplicate}
        onRemove={handleRemove}
        onScheduleTimeClick={handleScheduleTimeClick}
        onDeleteSchedule={handleDeleteSchedule}
      />
    )),
    [
      schedulesMap,
      disabledRemoveButton,
      handleSearchClick,
      handleDuplicate,
      handleRemove,
      handleScheduleTimeClick,
      handleDeleteSchedule
    ]
  );

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {timeTableList}
      </Flex>
      <SearchDialog 
        searchInfo={searchInfo} 
        onClose={handleCloseSearch}
      />
    </>
  );
};

export default memo(ScheduleTables);