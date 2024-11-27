import { FormControl, FormLabel, Select } from "@chakra-ui/react";
import { memo } from "react";

interface Props {
	value: number | undefined;
	onCreditsChange: (value: number) => void;
}

const CreditSelect = memo(({ value, onCreditsChange }: Props) => {
	return (
		<FormControl>
			<FormLabel>학점</FormLabel>
			<Select value={value} onChange={(e) => onCreditsChange(Number(e.target.value))}>
				<option value="">전체</option>
				<option value="1">1학점</option>
				<option value="2">2학점</option>
				<option value="3">3학점</option>
			</Select>
		</FormControl>
	);
});

export default CreditSelect;
