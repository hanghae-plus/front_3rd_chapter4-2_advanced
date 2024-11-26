import { Checkbox, CheckboxGroup, FormControl, FormLabel, HStack } from "@chakra-ui/react";
import { DAY_LABELS } from "../basic/constants";

interface Props {
	value: string[];
	onChange: (value: string[]) => void;
}

const DaySelect = ({ value, onChange }: Props) => {
	return (
		<FormControl>
			<FormLabel>요일</FormLabel>
			<CheckboxGroup value={value} onChange={onChange}>
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
};

export default DaySelect;
