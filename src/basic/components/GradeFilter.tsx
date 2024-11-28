import {
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  HStack,
} from '@chakra-ui/react';
import { memo } from 'react';

type Props = {
  value?: number[];
  onChange: (value: number[]) => void;
};

export const GradeFilter = memo(function GradeFilter({
  value,
  onChange,
}: Props) {
  return (
    <FormControl>
      <FormLabel>학년</FormLabel>
      <CheckboxGroup
        value={value}
        onChange={(value) => onChange(value.map(Number))}
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
