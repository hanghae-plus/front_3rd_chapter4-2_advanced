import { Checkbox, CheckboxGroup, FormControl, FormLabel, HStack } from "@chakra-ui/react";

interface Props {
	value: number[];
	onChange: (value: number[]) => void;
}

const GradeSelect = ({ value, onChange }: Props) => {
	return (
		<FormControl>
			<FormLabel>학년</FormLabel>
			<CheckboxGroup value={value} onChange={onChange}>
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
};

export default GradeSelect;
