import { Button, ButtonGroup, Flex, Heading, Stack } from "@chakra-ui/react";
import ScheduleTable from "./ScheduleTable.tsx";
import { useScheduleContext } from "./ScheduleContext.tsx";
import SearchDialog from "./SearchDialog.tsx";
import { memo, useMemo, useState } from "react";
import ScheduleDndProvider from "./ScheduleDndProvider.tsx";
import dummyScheduleMap from "./dummyScheduleMap.ts";

export const ScheduleTables = memo(() => {
	const { getSchedule, handleDuplicate, handleRemove, handleDelete } = useScheduleContext();
	const [searchInfo, setSearchInfo] = useState<{
		tableId: string;
		day?: string;
		time?: number;
	} | null>(null);

	const [tableIds, setTableIds] = useState<string[]>(Object.keys(dummyScheduleMap));

	const disabledRemoveButton = useMemo(() => tableIds.length === 1, [tableIds]);

	return (
		<>
			<Flex w="full" gap={6} p={6} flexWrap="wrap">
				{tableIds.map((tableId, index) => (
					// {Object.entries(schedulesMap).map(([tableId, schedules], index) => (
					<Stack key={tableId} width="600px">
						<Flex justifyContent="space-between" alignItems="center">
							<Heading as="h3" fontSize="lg">
								시간표 {index + 1}
							</Heading>
							<ButtonGroup size="sm" isAttached>
								<Button colorScheme="green" onClick={() => setSearchInfo({ tableId })}>
									시간표 추가
								</Button>
								<Button colorScheme="green" mx="1px" onClick={() => handleDuplicate(tableId)}>
									복제
								</Button>
								<Button
									colorScheme="green"
									isDisabled={disabledRemoveButton}
									onClick={() => {
										handleRemove(tableId);
										setTableIds((prev) => prev.filter((id) => id !== tableId));
									}}
								>
									삭제
								</Button>
							</ButtonGroup>
						</Flex>

						<ScheduleDndProvider>
							<ScheduleTable
								key={`schedule-table-${index}`}
								schedules={getSchedule(tableId)}
								tableId={tableId}
								onScheduleTimeClick={(timeInfo) => setSearchInfo({ tableId, ...timeInfo })}
								onDeleteButtonClick={({ day, time }) => handleDelete({ tableId, day, time })}
							/>
						</ScheduleDndProvider>
					</Stack>
				))}
			</Flex>
			<SearchDialog searchInfo={searchInfo} onClose={() => setSearchInfo(null)} />
		</>
	);
});
