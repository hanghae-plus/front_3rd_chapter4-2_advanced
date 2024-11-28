import { memo } from 'react';
import { FormControl, FormLabel, Input } from '@chakra-ui/react';

const SearchKeyword = memo(
  ({ query, onChange }: { query: string; onChange: (value: string) => void }) => {
    return (
      <FormControl>
        <FormLabel>검색어</FormLabel>
        <Input
          placeholder="과목명 또는 과목코드"
          value={query}
          onChange={(e) => onChange(e.target.value)}
        />
      </FormControl>
    );
  }
);

export default SearchKeyword;
