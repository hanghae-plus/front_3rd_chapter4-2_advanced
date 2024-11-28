import {
	createContext,
	PropsWithChildren,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";
import { Schedule } from "./types.ts";
import dummyScheduleMap from "./dummyScheduleMap.ts";
import { DAY_LABELS } from "./constants.ts";

interface ScheduleContextType {
	getSchedule: (tableId: string) => Schedule[];
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	updateSchedule: (event: any) => void;
	handleAdd: (target: { tableId: string; schedules: Schedule[] }) => void;
	handleDuplicate: (targetId: string) => void;
	handleRemove: (targetId: string) => void;
	handleDelete: (target: { tableId: string; day: string; time: number }) => void;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const useScheduleContext = () => {
	const context = useContext(ScheduleContext);
	if (context === undefined) {
		throw new Error("useSchedule must be used within a ScheduleProvider");
	}
	return context;
};

export const ScheduleProvider = ({ children }: PropsWithChildren) => {
	const [schedulesMap, setSchedulesMap] = useState<Record<string, Schedule[]>>(dummyScheduleMap);

	const getSchedule = useCallback(
		(tableId: string) => {
			return schedulesMap[tableId] || [];
		},
		[schedulesMap]
	);

	const updateSchedule = useCallback(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(event: any) => {
			const { active, delta } = event;
			const { x, y } = delta;
			const [tableId, index] = active.id.split(":");
			const moveDayIndex = Math.floor(x / 80);
			const moveTimeIndex = Math.floor(y / 30);

			setSchedulesMap((prev) => {
				const schedule = prev[tableId][Number(index)];
				const nowDayIndex = DAY_LABELS.indexOf(schedule.day as (typeof DAY_LABELS)[number]);

				const updated = {
					...schedule,
					day: DAY_LABELS[nowDayIndex + moveDayIndex],
					range: schedule.range.map((time) => time + moveTimeIndex),
				};

				const updatedSchedules = prev[tableId].map((targetSchedule, targetIndex) => {
					if (targetIndex !== Number(index)) {
						return targetSchedule;
					}
					return updated;
				});
				return {
					...prev,
					[tableId]: updatedSchedules,
				};
			});
		},
		[]
	);

	const handleAdd = useCallback(
		({ tableId, schedules }: { tableId: string; schedules: Schedule[] }) => {
			setSchedulesMap((prev) => ({
				...prev,
				[tableId]: [...prev[tableId], ...schedules],
			}));
		},
		[]
	);

	const handleDuplicate = useCallback((targetId: string) => {
		setSchedulesMap((prev) => ({
			...prev,
			[`schedule-${Date.now()}`]: [...prev[targetId]],
		}));
	}, []);

	const handleRemove = useCallback((targetId: string) => {
		setSchedulesMap((prev) => {
			delete prev[targetId];
			return { ...prev };
		});
	}, []);

	const handleDelete = useCallback(
		({ tableId, day, time }: { tableId: string; day: string; time: number }) => {
			setSchedulesMap((prev) => ({
				...prev,
				[tableId]: prev[tableId].filter(
					(schedule) => schedule.day !== day || !schedule.range.includes(time)
				),
			}));
		},
		[]
	);

	const value = useMemo(
		() => ({
			getSchedule,
			updateSchedule,
			handleAdd,
			handleDuplicate,
			handleRemove,
			handleDelete,
		}),
		[getSchedule, updateSchedule, handleAdd, handleDuplicate, handleRemove, handleDelete]
	);

	return <ScheduleContext.Provider value={value}>{children}</ScheduleContext.Provider>;
};
