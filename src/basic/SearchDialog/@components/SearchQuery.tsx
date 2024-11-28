import { memo } from "react";
import { FormControl, FormLabel, Input } from "@chakra-ui/react";

type Props = {
	value: string;
	changeSearchOption: (
		field: keyof SearchOption,
		value: SearchOption[typeof field]
	) => void;
};

export const SearchQuery = memo(({ value, changeSearchOption }: Props) => {
	return (
		<FormControl>
			<FormLabel>검색어</FormLabel>
			<Input
				placeholder="과목명 또는 과목코드"
				value={value}
				onChange={(e) => changeSearchOption("query", e.target.value)}
			/>
		</FormControl>
	);
});
