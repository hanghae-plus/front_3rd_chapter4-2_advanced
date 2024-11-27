import { Flex } from "@chakra-ui/react";
// import ScheduleTable from "./ScheduleTable.tsx";
import { useScheduleContext } from "./ScheduleContext.tsx";
import SearchDialog from "./SearchDialog.tsx";
import { useState } from "react";
import { ScheduleTableWrapper } from "./ScheduleTableWrapper";

interface SearchInfo {
  tableId: string;
  day?: string;
  time?: number;
}

export const ScheduleTables = () => {
  const { tables, duplicateTable, removeTable } = useScheduleContext();
  const [searchInfo, setSearchInfo] = useState<SearchInfo | null>(null);

  // const disabledRemoveButton = Object.keys(schedulesMap).length === 1

  // const duplicate = (targetId: string) => {
  //   setSchedulesMap(prev => ({
  //     ...prev,
  //     [`schedule-${Date.now()}`]: [...prev[targetId]]
  //   }))
  // }

  // const remove = (targetId: string) => {
  //   setSchedulesMap(prev => {
  //     delete prev[targetId];
  //     return { ...prev };
  //   })
  // }


  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {tables.map((table, index) => (
          <ScheduleTableWrapper
            key={table.id}
            tableId={table.id}
            index={index}
            onDuplicate={() => duplicateTable(table.id)}
            onRemove={() => removeTable(table.id)}
            canRemove={tables.length > 1}
            onSearchDialogOpen={(info) => setSearchInfo({ tableId: table.id, ...info })}
          />
        ))}
      </Flex>
      <SearchDialog searchInfo={searchInfo} onClose={() => setSearchInfo(null)}/>
    </>
  );
}
