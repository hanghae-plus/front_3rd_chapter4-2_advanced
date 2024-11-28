import { Button, ButtonGroup, Flex, Heading, Stack } from "@chakra-ui/react";
import ScheduleTable from "./ScheduleTable.tsx";
import { useScheduleContext } from "./ScheduleContext.tsx";
import SearchDialog from "./SearchDialog.tsx";
import { memo, useCallback, useMemo, useState } from "react";
import { useDndMonitor } from "@dnd-kit/core";

const ScheduleTablePanel = memo(({
  tableId,
  index,
  disabledRemoveButton,
  onSearchAddClick,
  onScheduleTimeClick,
}: {
  tableId: string;
  index: number;
  disabledRemoveButton: boolean;
  onSearchAddClick: () => void;
  onScheduleTimeClick: (timeInfo: { day: string; time: number }) => void;
}) => {
  const [draggingTableId, setDraggingTableId] = useState<string | null>(null);
  const { duplicateSchedules, removeSchedules, deleteSchedule, getSchedules, updateSchedules } = useScheduleContext();

  const schedules = useMemo(
    () => getSchedules(tableId),
    [getSchedules, tableId]
  );

  useDndMonitor({
    onDragStart(event) {
      const [activeTableId] = (event.active.id as string).split(":");
      if (activeTableId !== tableId) return;
      setDraggingTableId(activeTableId);
    },
    onDragEnd(event) {
      const [activeTableId] = (event.active.id as string).split(":");
      if (activeTableId !== tableId) return;
      updateSchedules(event);
      setDraggingTableId(activeTableId);
    },
  });

  return (
    <Stack key={tableId} width="600px">
      <Flex justifyContent="space-between" alignItems="center">
        <Heading as="h3" fontSize="lg">시간표 {index + 1}</Heading>
        <ButtonGroup size="sm" isAttached>
          <Button colorScheme="green" onClick={onSearchAddClick}>시간표 추가</Button>
          <Button colorScheme="green" mx="1px" onClick={() => duplicateSchedules(tableId)}>복제</Button>
          <Button colorScheme="green" isDisabled={disabledRemoveButton}
                  onClick={() => removeSchedules(tableId)}>삭제</Button>
        </ButtonGroup>
      </Flex>
      <ScheduleTable
        key={`schedule-table-${index}`}
        schedules={schedules}
        draggingTableId={draggingTableId}
        tableId={tableId}
        onScheduleTimeClick={onScheduleTimeClick}
        onDeleteButtonClick={({ day, time }) => deleteSchedule(tableId, day, time)}
      />
    </Stack>
  );
});

export const ScheduleTables = () => {
  const { schedulesMap } = useScheduleContext();
  const [searchInfo, setSearchInfo] = useState<{
    tableId: string;
    day?: string;
    time?: number;
  } | null>(null);

  const tableIds = useMemo(() => Object.keys(schedulesMap), [schedulesMap]);

  const disabledRemoveButton = tableIds.length === 1;

  const handleSearchAdd = useCallback((tableId: string)=> {
    setSearchInfo({ tableId })
  }, []);

  const handleScheduleTimeClick = useCallback((tableId: string, timeInfo: { day: string; time: number }) => {
    setSearchInfo({ tableId, ...timeInfo });
  }, []);

  const handleSearchClose = useCallback(() => setSearchInfo(null), []);

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {tableIds.map((tableId, index) => (
          <ScheduleTablePanel
            key={tableId}
            tableId={tableId}
            index={index}
            disabledRemoveButton={disabledRemoveButton}
            onSearchAddClick={() => handleSearchAdd(tableId)}
            onScheduleTimeClick={(timeInfo: { day: string; time: number }) => handleScheduleTimeClick(tableId, timeInfo)}
          />
        ))}
      </Flex>
      <SearchDialog searchInfo={searchInfo} onClose={handleSearchClose}/>
    </>
  );
}
