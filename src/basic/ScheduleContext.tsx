import React, { createContext, PropsWithChildren, useContext, useMemo, useState } from "react"
import { Schedule } from "./types.ts"
import dummyScheduleMap from "./dummyScheduleMap.ts"

interface ScheduleContextType {
  schedulesMap: Record<string, Schedule[]>
  setSchedulesMap: React.Dispatch<React.SetStateAction<Record<string, Schedule[]>>>
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined)

export const useScheduleContext = () => {
  const context = useContext(ScheduleContext)
  if (context === undefined) {
    throw new Error("useSchedule must be used within a ScheduleProvider")
  }
  return context
}

export const ScheduleProvider = ({ children }: PropsWithChildren) => {
  const [schedulesMap, setSchedulesMap] = useState<Record<string, Schedule[]>>(dummyScheduleMap)
  // Context 값을 메모이제이션하여 불필요한 렌더링 방지
  const contextValue = useMemo(
    () => ({ schedulesMap, setSchedulesMap }),
    [schedulesMap, setSchedulesMap]
  )

  return <ScheduleContext.Provider value={contextValue}>{children}</ScheduleContext.Provider>
}
