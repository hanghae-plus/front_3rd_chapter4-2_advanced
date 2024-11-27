import { FormControl, FormLabel, Select } from "@chakra-ui/react";
import { memo } from "react";

interface CreditSelectProps {
  value?: number;
  onChange: (value: number | undefined) => void;
 }
 
 export const CreditSelect = memo(({ value, onChange }: CreditSelectProps) => (
  <FormControl>
    <FormLabel>학점</FormLabel>
    <Select
      value={value}
      onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
    >
      <option value="">전체</option>
      <option value="1">1학점</option>
      <option value="2">2학점</option>
      <option value="3">3학점</option>
    </Select>
  </FormControl>
 ));