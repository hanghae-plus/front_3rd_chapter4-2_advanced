import { Checkbox, CheckboxGroup, FormControl, FormLabel, HStack } from "@chakra-ui/react";
import { DAY_LABELS } from "../../basic/constants";
import { memo } from "react";

interface Props {
	value: string[];
	onDaysChange: (value: string[]) => void;
}

const DaySelect = memo(({ value, onDaysChange }: Props) => {
	return (
		<FormControl>
			<FormLabel>요일</FormLabel>
			<CheckboxGroup value={value} onChange={(value) => onDaysChange(value as string[])}>
				<HStack spacing={4}>
					{DAY_LABELS.map((day) => (
						<Checkbox key={day} value={day}>
							{day}
						</Checkbox>
					))}
				</HStack>
			</CheckboxGroup>
		</FormControl>
	);
});

export default DaySelect;
