import { Flex } from "@chakra-ui/react";
import { memo, useCallback, useMemo } from "react";
import { useScheduleContext } from "../../context/ScheduleContext.tsx";
import SearchDialog from "../dialog/SearchDialog.tsx";
import { useState } from "react";
import { TimeTable } from "./TimeTable.tsx";

export const ScheduleTables = memo(() => {
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
});
