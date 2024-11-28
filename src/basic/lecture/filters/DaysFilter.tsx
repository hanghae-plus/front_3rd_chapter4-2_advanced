import {
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  HStack,
} from "@chakra-ui/react";
import { memo, useEffect } from "react";
import { DAY_LABELS } from "../../constants";

type Props = {
  value?: string[];
  onChange: (value: string[]) => void;
};

export const DaysFilter = memo(function DaysFilter({ value, onChange }: Props) {
  useEffect(() => {
    console.log("DaysFilter render");
  });

  return (
    <FormControl>
      <FormLabel>요일</FormLabel>
      <CheckboxGroup value={value} onChange={onChange}>
        <HStack spacing={4}>
          {DAY_LABELS.map((day) => (
            <Checkbox key={day} value={day}>
              {day}
            </Checkbox>
          ))}
        </HStack>
      </CheckboxGroup>
    </FormControl>
  );
});
