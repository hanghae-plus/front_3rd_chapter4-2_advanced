import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import { memo, useEffect } from "react";

type Props = {
  value?: string;
  onChange: (value: string) => void;
};

export const Search = memo(function Search({ value, onChange }: Props) {
  useEffect(() => {
    console.log("Search render");
  });
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
