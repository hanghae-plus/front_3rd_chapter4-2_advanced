import { memo, useCallback } from "react";
import { useTableSchedules } from "../../context/ScheduleContext";
import { Button, ButtonGroup, Flex, Heading, Stack } from "@chakra-ui/react";
import ScheduleTable from "./ScheduleTable";

export const TimeTable = memo(
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
