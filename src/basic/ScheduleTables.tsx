import { Button, ButtonGroup, Flex, Heading, Stack } from "@chakra-ui/react";
import { memo, useCallback, useMemo } from "react";
import ScheduleTable from "./ScheduleTable.tsx";
import { useScheduleContext, useTableSchedules } from "./ScheduleContext.tsx";
import SearchDialog from "./SearchDialog.tsx";
import { useState } from "react";

const TimeTable = memo(
  ({
    tableId,
    index,
    disabledRemoveButton,
    onSearchClick,
    onDuplicate,
    onRemove,
  }: {
    tableId: string;
    index: number;
    disabledRemoveButton: boolean;
    onSearchClick: (tableId: string) => void;
    onDuplicate: (tableId: string) => void;
    onRemove: (tableId: string) => void;
  }) => {
    // 개별 테이블의 스케줄만 구독
    const { schedules, updateSchedules } = useTableSchedules(tableId);

    const handleScheduleTimeClick = useCallback(() => {
      onSearchClick(tableId);
    }, [tableId, onSearchClick]);

    const handleDeleteSchedule = useCallback(
      ({ day, time }: { day: string; time: number }) => {
        updateSchedules((currentSchedules) =>
          currentSchedules.filter(
            (schedule) => schedule.day !== day || !schedule.range.includes(time)
          )
        );
      },
      [updateSchedules]
    );

    return (
      <Stack width="600px">
        <Flex justifyContent="space-between" alignItems="center">
          <Heading as="h3" fontSize="lg">
            시간표 {index + 1}
          </Heading>
          <ButtonGroup size="sm" isAttached>
            <Button colorScheme="green" onClick={() => onSearchClick(tableId)}>
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
  }
);

export const ScheduleTables = () => {
  const { schedulesMap, setSchedulesMap } = useScheduleContext();
  const [searchInfo, setSearchInfo] = useState<{
    tableId: string;
    day?: string;
    time?: number;
  } | null>(null);

  const tableIds = useMemo(() => Object.keys(schedulesMap), [schedulesMap]);
  const disabledRemoveButton = useMemo(() => tableIds.length === 1, [tableIds]);

  const handleDuplicate = useCallback(
    (targetId: string) => {
      setSchedulesMap((prev) => ({
        ...prev,
        [`schedule-${Date.now()}`]: [...prev[targetId]],
      }));
    },
    [setSchedulesMap]
  );

  const handleRemove = useCallback(
    (targetId: string) => {
      setSchedulesMap((prev) => {
        const newMap = { ...prev };
        delete newMap[targetId];
        return newMap;
      });
    },
    [setSchedulesMap]
  );

  const handleSearchClick = useCallback((tableId: string) => {
    setSearchInfo({ tableId });
  }, []);

  const handleCloseSearch = useCallback(() => {
    setSearchInfo(null);
  }, []);

  // 시간표 목록을 메모이제이션
  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {tableIds.map((tableId, index) => (
          <TimeTable
            key={tableId}
            tableId={tableId}
            index={index}
            disabledRemoveButton={disabledRemoveButton}
            onSearchClick={handleSearchClick}
            onDuplicate={handleDuplicate}
            onRemove={handleRemove}
          />
        ))}
      </Flex>
      <SearchDialog searchInfo={searchInfo} onClose={handleCloseSearch} />
    </>
  );
};
