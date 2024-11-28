import { Flex } from "@chakra-ui/react";
import { useTableIds } from "./ScheduleContext.tsx";
import SearchDialog from "./SearchDialog.tsx";
import { useState } from "react";
import { ScheduleTableWrapper } from "./ScheduleTableWrapper";

interface SearchInfo {
  tableId: string;
  day?: string;
  time?: number;
}

export const ScheduleTables = () => {
  const { tableIds, duplicateTable, removeTable } = useTableIds();
  const [searchInfo, setSearchInfo] = useState<SearchInfo | null>(null);

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {tableIds.map((id, index) => (
          <ScheduleTableWrapper
            key={id}
            tableId={id}
            index={index}
            onDuplicate={() => duplicateTable(id)}
            onRemove={() => removeTable(id)}
            canRemove={tableIds.length > 1}
            onSearchDialogOpen={(info) => setSearchInfo({ tableId: id, ...info })}
          />
        ))}
      </Flex>
      <SearchDialog searchInfo={searchInfo} onClose={() => setSearchInfo(null)}/>
    </>
  );
};