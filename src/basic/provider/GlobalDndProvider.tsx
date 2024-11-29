import { DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { PropsWithChildren } from "react";

export default function GlobalDndProvider({ children }: PropsWithChildren) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  return (
    <DndContext sensors={sensors}>
      {children}
    </DndContext>
  );
}