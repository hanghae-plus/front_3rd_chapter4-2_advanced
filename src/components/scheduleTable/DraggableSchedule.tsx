import { ComponentProps, memo } from "react";
import { CellSize, DAY_LABELS } from "../../basic/constants";
import { Schedule } from "../../basic/types";
import {
	Box,
	Button,
	Popover,
	PopoverArrow,
	PopoverBody,
	PopoverCloseButton,
	PopoverContent,
	PopoverTrigger,
	Text,
} from "@chakra-ui/react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

const DraggableSchedule = memo(
	({
		id,
		data,
		bg,
		onDeleteButtonClick,
	}: { id: string; data: Schedule } & ComponentProps<typeof Box> & {
			onDeleteButtonClick: () => void;
		}) => {
		const { day, range, room, lecture } = data;
		const { attributes, setNodeRef, listeners, transform } = useDraggable({ id });
		const leftIndex = DAY_LABELS.indexOf(day as (typeof DAY_LABELS)[number]);
		const topIndex = range[0] - 1;
		const size = range.length;

		return (
			<Popover>
				<PopoverTrigger>
					<Box
						position="absolute"
						left={`${120 + CellSize.WIDTH * leftIndex + 1}px`}
						top={`${40 + (topIndex * CellSize.HEIGHT + 1)}px`}
						width={CellSize.WIDTH - 1 + "px"}
						height={CellSize.HEIGHT * size - 1 + "px"}
						bg={bg}
						p={1}
						boxSizing="border-box"
						cursor="pointer"
						ref={setNodeRef}
						transform={CSS.Translate.toString(transform)}
						{...listeners}
						{...attributes}
					>
						<Text fontSize="sm" fontWeight="bold">
							{lecture.title}
						</Text>
						<Text fontSize="xs">{room}</Text>
					</Box>
				</PopoverTrigger>
				<PopoverContent onClick={(event) => event.stopPropagation()}>
					<PopoverArrow />
					<PopoverCloseButton />
					<PopoverBody>
						<Text>강의를 삭제하시겠습니까?</Text>
						<Button colorScheme="red" size="xs" onClick={onDeleteButtonClick}>
							삭제
						</Button>
					</PopoverBody>
				</PopoverContent>
			</Popover>
		);
	},
	(prevProps, nextProps) => {
		// 불필요한 리렌더링 방지를 위한 custom compare 함수
		return (
			prevProps.id === nextProps.id &&
			prevProps.bg === nextProps.bg &&
			prevProps.data.day === nextProps.data.day &&
			prevProps.data.range.toString() === nextProps.data.range.toString() &&
			prevProps.data.room === nextProps.data.room &&
			prevProps.data.lecture.title === nextProps.data.lecture.title
		);
	}
);

export default DraggableSchedule;
