import { Flex } from "@chakra-ui/react";
import { useScheduleContext } from "../../contexts/ScheduleContext.tsx";
import SearchDialog from "../SearchDialog/SearchDialog.tsx";
import {useCallback, useMemo, useState} from "react";
import TimeTableContainer from "./TimeTableContainer.tsx";

export const ScheduleTables = () => {
  const { schedulesMap, setSchedulesMap } = useScheduleContext();
  const [searchInfo, setSearchInfo] = useState<{
    tableId: string;
    day?: string;
    time?: number;
  } | null>(null);

  const tableIds = useMemo(() => Object.keys(schedulesMap), [schedulesMap]);
  const disabledRemoveButton = useMemo(() => tableIds.length === 1,[tableIds])

  const searchSchedule = useCallback((tableId: string, timeInfo?:  { day: string, time: number }) => {
    setSearchInfo({ tableId, ...timeInfo })
  },[])

  const duplicate = useCallback((targetId: string) => {
    setSchedulesMap(prev => ({
      ...prev,
      [`schedule-${Date.now()}`]: [...prev[targetId]]
    }))
  },[])

  const remove = useCallback((targetId: string) => {
    setSchedulesMap(prev => {
      delete prev[targetId];
      return { ...prev };
    })
  },[]);

  const close = useCallback(() => setSearchInfo(null), [])

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {Object.entries(schedulesMap).map(([tableId], index) => (
          <TimeTableContainer
              key={tableId}
              tableId={tableId}
              index={index}
              isDeleteDisabled={disabledRemoveButton}
              onScheduleAdd={searchSchedule}
              onDuplicate={duplicate}
              onRemove={remove} />
        ))}
      </Flex>
      <SearchDialog searchInfo={searchInfo} onClose={close}/>
    </>
  );
}
