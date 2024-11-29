import { Flex } from '@chakra-ui/react';
import { useCallback, useMemo, useState } from 'react';
import { useScheduleContext } from '../contexts/ScheduleContext.tsx';
import { ScheduleTableSection } from './ScheduleTable/ScheduleTableSection.tsx';
import SearchDialog from './SearchDialog/SearchDialog.tsx';

export const ScheduleTables = () => {
  const { schedulesMap } = useScheduleContext();
  const tableIds = useMemo(() => Object.keys(schedulesMap), [schedulesMap]);

  const [searchInfo, setSearchInfo] = useState<{
    tableId: string;
    day?: string;
    time?: number;
  } | null>(null);

  const closeSearchDialog = useCallback(() => {
    setSearchInfo(null);
  }, [setSearchInfo]);

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {tableIds.map((tableId, index) => (
          <ScheduleTableSection
            key={tableId}
            tableId={tableId}
            index={index}
            setSearchInfo={setSearchInfo}
          />
        ))}
      </Flex>
      <SearchDialog searchInfo={searchInfo} onClose={closeSearchDialog} />
    </>
  );
};
