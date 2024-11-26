import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import { memo } from "react";

interface Props {
	value: string | undefined;
	onQueryChange: (value: string) => void;
}

const SearchInput = memo(({ value, onQueryChange }: Props) => {
	return (
		<FormControl>
			<FormLabel>검색어</FormLabel>
			<Input
				placeholder="과목명 또는 과목코드"
				value={value}
				onChange={(e) => onQueryChange(e.target.value)}
			/>
		</FormControl>
	);
});

export default SearchInput;
