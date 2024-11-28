import { Button, Flex } from "@chakra-ui/react";
import { useScheduleContext } from "./ScheduleContext.tsx";
import SearchDialog from "./SearchDialog.tsx";
import { useCallback, useState } from "react";
import ScheduleTableWrapper from "./ScheduleTableWrapper.tsx";

export interface ScheduleTableWrapperProps {
  tableId: string;
  index: number;
  setSearchInfo: (
    info: { tableId: string; day?: string; time?: number } | null
  ) => void;
}

export const ScheduleTables = () => {
  const { tableIds, addTable } = useScheduleContext();
  const [searchInfo, setSearchInfo] = useState<{
    tableId: string;
    day?: string;
    time?: number;
  } | null>(null);

  const handleAddTable = useCallback(() => {
    const newTableId = `schedule-${Date.now()}`;
    addTable(newTableId);
  }, [addTable]);

  return (
    <>
      <Flex w='full' gap={6} p={6} flexWrap='wrap'>
        {tableIds.map((tableId, index) => (
          <ScheduleTableWrapper
            key={tableId}
            tableId={tableId}
            index={index}
            setSearchInfo={setSearchInfo}
          />
        ))}
        <Button onClick={handleAddTable}>새 시간표 추가</Button>
      </Flex>
      {searchInfo && (
        <SearchDialog
          searchInfo={searchInfo}
          onClose={() => setSearchInfo(null)}
        />
      )}
    </>
  );
};

export default ScheduleTables;
