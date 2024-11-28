import { Box, Checkbox, Stack } from "@chakra-ui/react";
import { ChangeEvent, memo, useCallback } from "react";

interface MajorListProps {
  majors: string[];
  selectedMajors: string[];
  onMajorChange: (values: string[]) => void;
}

const MajorCheckbox = memo(
  ({
    major,
    checked,
    onChange,
  }: {
    major: string;
    checked: boolean;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  }) => (
    <Box>
      <Checkbox size="sm" value={major} checked={checked} onChange={onChange}>
        {major.replace(/<p>/gi, " ")}
      </Checkbox>
    </Box>
  )
);

export const MajorList = memo(
  ({ majors, selectedMajors, onMajorChange }: MajorListProps) => {
    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (e.target.checked) {
          onMajorChange([...selectedMajors, value]);
        } else {
          onMajorChange(selectedMajors.filter((v) => v !== value));
        }
      },
      [selectedMajors, onMajorChange]
    );

    return (
      <Stack
        spacing={2}
        overflowY="auto"
        h="100px"
        border="1px solid"
        borderColor="gray.200"
        borderRadius={5}
        p={2}
      >
        {majors.map((major) => (
          <MajorCheckbox
            key={major}
            major={major}
            checked={selectedMajors.includes(major)}
            onChange={handleChange}
          />
        ))}
      </Stack>
    );
  }
);
