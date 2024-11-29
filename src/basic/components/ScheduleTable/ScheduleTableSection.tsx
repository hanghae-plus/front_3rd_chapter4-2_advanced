import { Button, ButtonGroup, Flex, Heading, Stack } from '@chakra-ui/react';
import { memo, useCallback, useMemo } from 'react';
import { useScheduleContext } from '../../contexts/ScheduleContext';
import ScheduleTable from './ScheduleTable';

type Props = {
  tableId: string;

  index: number;
  setSearchInfo: (searchInfo: { tableId: string }) => void;
};

export const ScheduleTableSection = memo(
  ({
    tableId,

    index,
    setSearchInfo,
  }: Props) => {
    const {
      schedulesMap,
      getSchedules,
      duplicateSchedule,
      removeSchedule,
      deleteSchedule,
    } = useScheduleContext();

    const schedules = useMemo(
      () => getSchedules(tableId),
      [getSchedules, tableId],
    );
    const disabledRemoveButton = Object.keys(schedulesMap).length === 1;

    const handleSearchInfo = useCallback(
      (timeInfo?: { day: string; time: number }) => {
        setSearchInfo({ tableId, ...timeInfo });
      },
      [setSearchInfo, tableId],
    );

    return (
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
          onScheduleTimeClick={handleSearchInfo}
          onDeleteButtonClick={deleteSchedule}
        />
      </Stack>
    );
  },
);
