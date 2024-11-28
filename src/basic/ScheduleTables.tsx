import { Button, ButtonGroup, Flex, Heading, Stack } from "@chakra-ui/react";
import ScheduleTable from "./ScheduleTable.tsx";
import { useScheduleContext } from "./ScheduleContext.tsx";
import SearchDialog from "./SearchDialog.tsx";
import { useState, memo, useCallback } from "react";

export const ScheduleTables = memo(() => {
  const { schedulesMap, setSchedulesMap } = useScheduleContext();
  const [searchInfo, setSearchInfo] = useState<{
    tableId: string;
    day?: string;
    time?: number;
  } | null>(null);

  const disabledRemoveButton = Object.keys(schedulesMap).length === 1;

  const duplicate = useCallback((targetId: string) => {
    setSchedulesMap(prev => ({
      ...prev,
      [`schedule-${Date.now()}`]: [...prev[targetId]]
    }));
  }, [setSchedulesMap]);

  const remove = useCallback((targetId: string) => {
    setSchedulesMap(prev => {
      const newMap = { ...prev };
      delete newMap[targetId];
      return newMap;
    });
  }, [setSchedulesMap]);

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {Object.entries(schedulesMap).map(([tableId, schedules], index) => (
          <Stack key={tableId} width="600px">
            <Flex justifyContent="space-between" alignItems="center">
              <Heading as="h3" fontSize="lg">시간표 {index + 1}</Heading>
              <ButtonGroup size="sm" isAttached>
                <Button colorScheme="green" onClick={() => setSearchInfo({ tableId })}>시간표 추가</Button>
                <Button colorScheme="green" mx="1px" onClick={() => duplicate(tableId)}>복제</Button>
                <Button colorScheme="green" isDisabled={disabledRemoveButton}
                        onClick={() => remove(tableId)}>삭제</Button>
              </ButtonGroup>
            </Flex>
            <ScheduleTable
              schedules={schedules}
              tableId={tableId}
              setSearchInfo={setSearchInfo}
            />
          </Stack>
        ))}
      </Flex>
      <SearchDialog searchInfo={searchInfo} onClose={() => setSearchInfo(null)}/>
    </>
  );
});
