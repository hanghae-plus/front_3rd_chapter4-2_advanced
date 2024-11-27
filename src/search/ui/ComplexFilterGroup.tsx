import { FormControl, FormLabel, CheckboxGroup, Wrap, Tag, TagLabel, TagCloseButton, Stack, Box, Checkbox } from "@chakra-ui/react";
import { memo } from "react";

interface Option {
  id: string | number;
  label: string;
}

interface ComplexFilterGroupProps {
  label: string;
  options: Option[];
  value: Array<string | number>;
  onChange: (values: Array<string | number>) => void;
  tagLabelFormatter?: (value: string | number) => string;
  checkboxLabelFormatter?: (option: Option) => string;
}

const CheckboxList = memo(({ 
  options, 
  checkboxLabelFormatter 
}: { 
  options: Option[];
  checkboxLabelFormatter: (option: Option) => string;
}) => (
  <Stack spacing={2}>
    {options.map((option) => (
      <Box key={option.id}>
        <Checkbox size="sm" value={option.id}>
          {checkboxLabelFormatter(option)}
        </Checkbox>
      </Box>
    ))}
  </Stack>
));

export const ComplexFilterGroup = memo(({
  label,
  options,
  value,
  onChange,
  tagLabelFormatter = (v) => `${v}`,
  checkboxLabelFormatter = (opt) => opt.label
}: ComplexFilterGroupProps) => (
  <FormControl>
    <FormLabel>{label}</FormLabel>
    <CheckboxGroup
      colorScheme="green"
      value={value}
      onChange={onChange}
    >
      <Wrap spacing={1} mb={2}>
        {value.map((v) => (
          <Tag key={v} size="sm" variant="outline" colorScheme="blue">
            <TagLabel>{tagLabelFormatter(v)}</TagLabel>
            <TagCloseButton
              onClick={() => onChange(value.filter(item => item !== v))}
            />
          </Tag>
        ))}
      </Wrap>
      <Stack 
        spacing={2} 
        overflowY="auto" 
        h="100px" 
        border="1px solid" 
        borderColor="gray.200"
        borderRadius={5} 
        p={2}
      >
        <CheckboxList 
          options={options} 
          checkboxLabelFormatter={checkboxLabelFormatter}
        />
      </Stack>
    </CheckboxGroup>
  </FormControl>
));