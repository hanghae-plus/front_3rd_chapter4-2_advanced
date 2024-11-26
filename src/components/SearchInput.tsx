import { FormControl, FormLabel, Input } from "@chakra-ui/react";

interface Props {
	value: string | undefined;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput = ({ value, onChange }: Props) => {
	return (
		<FormControl>
			<FormLabel>검색어</FormLabel>
			<Input placeholder="과목명 또는 과목코드" value={value} onChange={onChange} />
		</FormControl>
	);
};

export default SearchInput;
