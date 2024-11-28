import { DndContext, Modifier, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from "react"
import { CellSize, DAY_LABELS } from "./constants.ts"
import { useScheduleContext } from "./ScheduleContext.tsx"

function createSnapModifier(): Modifier {
  return ({ transform, containerNodeRect, draggingNodeRect }) => {
    const containerTop = containerNodeRect?.top ?? 0
    const containerLeft = containerNodeRect?.left ?? 0
    const containerBottom = containerNodeRect?.bottom ?? 0
    const containerRight = containerNodeRect?.right ?? 0

    const { top = 0, left = 0, bottom = 0, right = 0 } = draggingNodeRect ?? {}

    const minX = containerLeft - left + 120 + 1
    const minY = containerTop - top + 40 + 1
    const maxX = containerRight - right
    const maxY = containerBottom - bottom

    return {
      ...transform,
      x: Math.min(Math.max(Math.round(transform.x / CellSize.WIDTH) * CellSize.WIDTH, minX), maxX),
      y: Math.min(
        Math.max(Math.round(transform.y / CellSize.HEIGHT) * CellSize.HEIGHT, minY),
        maxY
      ),
    }
  }
}

const modifiers = [createSnapModifier()]
const DndActiveContext = createContext<string | null>(null)

export const useDndActive = () => useContext(DndActiveContext)

export default function ScheduleDndProvider({ children }: PropsWithChildren) {
  const { schedulesMap, setSchedulesMap } = useScheduleContext()
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const [activeId, setActiveId] = useState<string | null>(null)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = useCallback(
    (event: any) => {
      const { active, delta } = event
      setActiveId(null)
      const { x, y } = delta
      const [tableId, indexStr] = active.id.split(":")
      const index = Number(indexStr)
      const schedule = schedulesMap[tableId][index]
      const nowDayIndex = DAY_LABELS.indexOf(schedule.day as (typeof DAY_LABELS)[number])
      const moveDayIndex = Math.floor(x / CellSize.WIDTH)
      const moveTimeIndex = Math.floor(y / CellSize.HEIGHT)

      setSchedulesMap((prev) => ({
        ...prev,
        [tableId]: prev[tableId].map((targetSchedule, targetIndex) => {
          if (targetIndex !== index) {
            return targetSchedule
          }
          return {
            ...targetSchedule,
            day: DAY_LABELS[nowDayIndex + moveDayIndex],
            range: targetSchedule.range.map((time) => time + moveTimeIndex),
          }
        }),
      }))
    },
    [schedulesMap, setSchedulesMap]
  )

  const contextValue = useMemo(() => activeId, [activeId])

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd} modifiers={modifiers}>
      <DndActiveContext.Provider value={contextValue}>{children}</DndActiveContext.Provider>
    </DndContext>
  )
}
