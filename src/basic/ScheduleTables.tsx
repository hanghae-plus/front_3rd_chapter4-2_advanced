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
  onUpdateSchedules,
  onSearchClick,
  onDuplicate,
  onRemove,
}: {
  tableId: string;
  schedules: Schedule[];
  index: number;
  disabledRemoveButton: boolean;
  onUpdateSchedules: (tableId: string, updater: (schedules: Schedule[]) => Schedule[]) => void;
  onSearchClick: (tableId: string, timeInfo?: { day: string; time: number }) => void;
  onDuplicate: (tableId: string) => void;
  onRemove: (tableId: string) => void;
}) => {
  const handleScheduleTimeClick = useCallback((timeInfo: { day: string; time: number }) => {
    onSearchClick(tableId, timeInfo);
  }, [tableId, onSearchClick]);

  const handleDeleteSchedule = useCallback(({ day, time }: { day: string; time: number }) => {
    onUpdateSchedules(tableId, (schedules) => 
      schedules.filter(schedule => 
        schedule.day !== day || !schedule.range.includes(time)
      )
    );
  }, [tableId, onUpdateSchedules]);

  return (
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
        schedules={schedules}
        tableId={tableId}
        onScheduleTimeClick={handleScheduleTimeClick}
        onDeleteButtonClick={handleDeleteSchedule}
      />
    </Stack>
  );
});

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

  const updateSchedules = useCallback((
    tableId: string, 
    updater: (schedules: Schedule[]) => Schedule[]
  ) => {
    setSchedulesMap(prev => ({
      ...prev,
      [tableId]: updater(prev[tableId])
    }));
  }, [setSchedulesMap]);

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
        onUpdateSchedules={updateSchedules}
        onSearchClick={handleSearchClick}
        onDuplicate={handleDuplicate}
        onRemove={handleRemove}
      />
    )),
    [
      schedulesMap,
      disabledRemoveButton,
      updateSchedules,
      handleSearchClick,
      handleDuplicate,
      handleRemove,
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