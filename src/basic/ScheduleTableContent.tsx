import { Button, ButtonGroup, Flex, Heading, Stack } from "@chakra-ui/react";
import ScheduleTable from "./ScheduleTable";
import { ScheduleTableWrapperProps } from "./ScheduleTables";
import { useScheduleContext } from "./ScheduleContext";
import { useTableContext } from "./TableContext";
import { useCallback } from "react";

export const ScheduleTableContent = ({
  tableId,
  index,
  setSearchInfo,
}: ScheduleTableWrapperProps) => {
  const { removeTable } = useScheduleContext();
  const { schedules, updateSchedule } = useTableContext();

  const handleScheduleTimeClick = useCallback(
    (timeInfo: { day: string; time: number }) => {
      setSearchInfo({ tableId, ...timeInfo });
    },
    [tableId, setSearchInfo]
  );

  const handleDeleteButtonClick = useCallback(
    ({ day, time }: { day: string; time: number }) => {
      const updatedSchedules = schedules.filter(
        (schedule) => schedule.day !== day || !schedule.range.includes(time)
      );
      updateSchedule(updatedSchedules);
    },
    [schedules, updateSchedule]
  );

  return (
    <Stack key={tableId} width='600px'>
      <Flex justifyContent='space-between' alignItems='center'>
        <Heading as='h3' fontSize='lg'>
          시간표 {index + 1}
        </Heading>
        <ButtonGroup size='sm' isAttached>
          <Button
            colorScheme='green'
            onClick={() => setSearchInfo({ tableId })}
          >
            시간표 추가
          </Button>
          <Button colorScheme='green' onClick={() => removeTable(tableId)}>
            삭제
          </Button>
        </ButtonGroup>
      </Flex>
      <ScheduleTable
        schedules={schedules}
        tableId={tableId}
        onScheduleTimeClick={handleScheduleTimeClick}
        onDeleteButtonClick={handleDeleteButtonClick}
      />
    </Stack>
  );
};
export default ScheduleTableContent;
