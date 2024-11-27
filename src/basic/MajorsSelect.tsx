import { useCallback } from "react";
import { useMajorsContext } from "./context/MajorsContext";
import { MajorsContextType } from "./types";
import { Box, Checkbox, CheckboxGroup, FormControl, FormLabel, Tag, TagCloseButton, TagLabel, Wrap } from "@chakra-ui/react";

export const MajorsSelect = ({ 
  selectedMajors, 
  onChange 
}: {
  selectedMajors: string[];
  onChange: (majors: string[]) => void;
}) => {
  const { majors, getMajorLabel } = useMajorsContext() as unknown as MajorsContextType;

  const handleRemoveMajor = useCallback((majorToRemove: string) => {
    onChange(selectedMajors.filter(major => major !== majorToRemove));
  }, [selectedMajors, onChange]);

  const handleToggleMajor = useCallback((major: string) => {
    if (selectedMajors.includes(major)) {
      handleRemoveMajor(major);
    } else {
      onChange([...selectedMajors, major]);
    }
  }, [selectedMajors, onChange, handleRemoveMajor]);

  return (
    <FormControl>
      <FormLabel>전공</FormLabel>
      <CheckboxGroup
        colorScheme="green"
        value={selectedMajors}
        onChange={(values) => onChange(values as string[])}
      >
        <Wrap spacing={1} mb={2}>
          {selectedMajors.map(major => (
            <Tag key={major} size="sm" variant="outline" colorScheme="blue">
              <TagLabel>{getMajorLabel(major)}</TagLabel>
              <TagCloseButton
                onClick={() => handleRemoveMajor(major)}
              />
            </Tag>
          ))}
        </Wrap>
        <Box
          overflowY="auto" 
          h="100px" 
          border="1px solid" 
          borderColor="gray.200"
          borderRadius={5} 
          p={2}
        >
          {Array.from(majors.entries()).map(([majorKey, majorLabel]) => (
            <Box key={majorKey}>
              <Checkbox
                size="sm"
                value={majorKey}
                isChecked={selectedMajors.includes(majorKey)}
                onChange={() => handleToggleMajor(majorKey)}
              >
                {majorLabel}
              </Checkbox>
            </Box>
          ))}
        </Box>
      </CheckboxGroup>
    </FormControl>
  );
};