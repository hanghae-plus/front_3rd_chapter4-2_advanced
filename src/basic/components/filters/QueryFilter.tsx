import { FormControl, FormLabel, Input } from '@chakra-ui/react';
import { memo, useEffect } from 'react';

type Props = {
  value?: string;
  onChange: (value: string) => void;
};

export const QueryFilter = memo(function QueryFilter({
  value,
  onChange,
}: Props) {
  useEffect(() => {});
  return (
    <FormControl>
      <FormLabel>검색어</FormLabel>
      <Input
        placeholder="과목명 또는 과목코드"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </FormControl>
  );
});
