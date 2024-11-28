import { memo } from 'react';
import { FormControl, FormLabel, Select } from '@chakra-ui/react';

const Credit = memo(
  ({ credits, onChange }: { credits?: number; onChange: (value?: number) => void }) => {
    return (
      <FormControl>
        <FormLabel>학점</FormLabel>
        <Select value={credits} onChange={(e) => onChange(Number(e.target.value))}>
          <option value="">전체</option>
          <option value="1">1학점</option>
          <option value="2">2학점</option>
          <option value="3">3학점</option>
        </Select>
      </FormControl>
    );
  }
);

export default Credit;
