import { FormControl, FormLabel, CheckboxGroup, HStack, Checkbox } from "@chakra-ui/react";
import { memo } from "react";

interface FilterCheckboxGroupProps {
  label: string;
  name: string;
  options: Array<{ id: string | number; label: string }>;
  colorScheme?: string;
  value: Array<string | number>;
  onChange: (values: Array<string | number>) => void;
}

// 개별 체크박스를 메모이제이션된 컴포넌트로 분리
const CheckboxItem = memo(({ 
  id, 
  label 
}: { 
  id: string | number; 
  label: string;
}) => (
  <Checkbox value={id}>
    {label}
  </Checkbox>
));

export const FilterCheckboxGroup = memo(({
  label,
  options,
  value,
  onChange
}: FilterCheckboxGroupProps) => (
  <FormControl>
    <FormLabel>{label}</FormLabel>
    <CheckboxGroup
      value={value}
      onChange={onChange}
    >
      <HStack spacing={4}>
        {options.map(({ id, label }) => (
          <CheckboxItem
            key={id}
            id={id}
            label={label}
          />
        ))}
      </HStack>
    </CheckboxGroup>
  </FormControl>
));