import { Checkbox, CheckboxGroup, FormControl, FormLabel, HStack } from "@chakra-ui/react";
import { memo } from "react";

interface Props {
	value: number[];
	onGradesChange: (value: number[]) => void;
}

const GradeSelect = memo(({ value, onGradesChange }: Props) => {
	return (
		<FormControl>
			<FormLabel>학년</FormLabel>
			<CheckboxGroup value={value} onChange={(value) => onGradesChange(value.map(Number))}>
				<HStack spacing={4}>
					{[1, 2, 3, 4].map((grade) => (
						<Checkbox key={grade} value={grade}>
							{grade}학년
						</Checkbox>
					))}
				</HStack>
			</CheckboxGroup>
		</FormControl>
	);
});

export default GradeSelect;
