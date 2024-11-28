import {Button, ButtonGroup, Flex, Heading, Stack} from "@chakra-ui/react";
import ScheduleTable from "./ScheduleTable.tsx";
import {memo, useCallback} from "react";
import {useSchedule} from "../../contexts/ScheduleContext.tsx";



interface Props {
    tableId: string;
    index: number;
    isDeleteDisabled: boolean;
    onScheduleAdd: (tableId: string, timeInfo?: { day: string, time: number }) => void;
    onDuplicate: (tableId: string) => void;
    onRemove: (tableId: string) => void;
}



const TimeTableContainer = memo(({tableId, index, isDeleteDisabled, onScheduleAdd, onDuplicate, onRemove}: Props) => {
    const {schedules, deleteSchedule} = useSchedule(tableId)

    const handleScheduleTimeClick = useCallback((timeInfo: { day: string, time: number }) => {
        onScheduleAdd(tableId, timeInfo);
    }, [tableId, onScheduleAdd]);

    const handleDeleteButtonClick = useCallback(
        ({ day, time }: { day: string; time: number }) => {
            deleteSchedule(tableId, day, time);
        }, [deleteSchedule, tableId]);

    return (
        <Stack key={tableId} width="600px">
            <Flex justifyContent="space-between" alignItems="center">
                <Heading as="h3" fontSize="lg">시간표 {index + 1}</Heading>
                <ButtonGroup size="sm" isAttached>
                    <Button colorScheme="green" onClick={() => onScheduleAdd(tableId)}>시간표 추가</Button>
                    <Button colorScheme="green" mx="1px" onClick={() => onDuplicate(tableId)}>복제</Button>
                    <Button colorScheme="green" isDisabled={isDeleteDisabled}
                            onClick={() => onRemove(tableId)}>삭제</Button>
                </ButtonGroup>
            </Flex>
            <ScheduleTable
                key={`schedule-table-${index}`}
                schedules={schedules}
                tableId={tableId}
                onScheduleTimeClick={handleScheduleTimeClick}
                onDeleteButtonClick={handleDeleteButtonClick}
            />
        </Stack>
    )
});

export default TimeTableContainer;