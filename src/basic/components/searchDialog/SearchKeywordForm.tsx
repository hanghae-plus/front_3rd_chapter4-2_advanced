import { memo } from "react";
import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import { SearchOption } from "../../types";

interface SearchKeywordFormProps {
  searchOptions: SearchOption;
  changeSearchOption: (field: keyof SearchOption, value: SearchOption[typeof field]) => void;
}

const SearchKeywordForm = memo(({ searchOptions, changeSearchOption }: SearchKeywordFormProps) => {
  return (
    <FormControl>
      <FormLabel>검색어</FormLabel>
      <Input
        placeholder="과목명 또는 과목코드"
        value={searchOptions.query}
        onChange={e => changeSearchOption("query", e.target.value)}
      />
    </FormControl>
  );
});

export default SearchKeywordForm;
