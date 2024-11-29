import { Button, ButtonGroup, Flex, Heading, Stack } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { useScheduleContext } from '../contexts/ScheduleContext.tsx';
import ScheduleTable from './ScheduleTable/ScheduleTable.tsx';
import SearchDialog from './SearchDialog/SearchDialog.tsx';

export const ScheduleTables = () => {
  const { schedulesMap, duplicateSchedule, removeSchedule, deleteSchedule } =
    useScheduleContext();
  const [searchInfo, setSearchInfo] = useState<{
    tableId: string;
    day?: string;
    time?: number;
  } | null>(null);

  const disabledRemoveButton = Object.keys(schedulesMap).length === 1;

  const closeSearchDialog = useCallback(() => {
    setSearchInfo(null);
  }, [setSearchInfo]);

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {Object.entries(schedulesMap).map(([tableId, schedules], index) => (
          <Stack key={tableId} width="600px">
            <Flex justifyContent="space-between" alignItems="center">
              <Heading as="h3" fontSize="lg">
                시간표 {index + 1}
              </Heading>
              <ButtonGroup size="sm" isAttached>
                <Button
                  colorScheme="green"
                  onClick={() => setSearchInfo({ tableId })}
                >
                  시간표 추가
                </Button>
                <Button
                  colorScheme="green"
                  mx="1px"
                  onClick={() => duplicateSchedule(tableId)}
                >
                  복제
                </Button>
                <Button
                  colorScheme="green"
                  isDisabled={disabledRemoveButton}
                  onClick={() => removeSchedule(tableId)}
                >
                  삭제
                </Button>
              </ButtonGroup>
            </Flex>
            <ScheduleTable
              key={`schedule-table-${index}`}
              schedules={schedules}
              tableId={tableId}
              onScheduleTimeClick={timeInfo =>
                setSearchInfo({ tableId, ...timeInfo })
              }
              onDeleteButtonClick={deleteSchedule}
            />
          </Stack>
        ))}
      </Flex>
      <SearchDialog searchInfo={searchInfo} onClose={closeSearchDialog} />
    </>
  );
};
