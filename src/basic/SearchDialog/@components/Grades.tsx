import {
	FormControl,
	FormLabel,
	CheckboxGroup,
	HStack,
	Checkbox,
} from "@chakra-ui/react";
import { memo } from "react";

type Props = {
	value: number[];
	changeSearchOption: ChangeSearchOption;
};

export const Grades = memo(({ value, changeSearchOption }: Props) => {
	return (
		<FormControl>
			<FormLabel>학년</FormLabel>
			<CheckboxGroup
				value={value}
				onChange={(value) => changeSearchOption("grades", value.map(Number))}
			>
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
