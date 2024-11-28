import {
  Box,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  Stack,
  Tag,
  TagCloseButton,
  TagLabel,
  Wrap,
} from '@chakra-ui/react';
import { memo, useMemo } from 'react';
import { Lecture } from '../../types.ts';
import { SearchOption } from './types';

const MajorCheckbox = memo(({ major }: { major: string }) => (
  <Box>
    <Checkbox size="sm" value={major}>
      {major.replace(/<p>/gi, ' ')}
    </Checkbox>
  </Box>
));

type MajorControlProps = {
  searchOptions: SearchOption;
  changeSearchOption: (
    field: keyof SearchOption,
    value: SearchOption[typeof field],
  ) => void;
  lectures: Lecture[];
};

export const MajorControl = ({
  searchOptions,
  changeSearchOption,
  lectures,
}: MajorControlProps) => {
  const allMajors = useMemo(
    () => [...new Set(lectures.map(lecture => lecture.major))],
    [lectures],
  );

  return (
    <FormControl>
      <FormLabel>전공</FormLabel>
      <CheckboxGroup
        colorScheme="green"
        value={searchOptions.majors}
        onChange={values => changeSearchOption('majors', values as string[])}
      >
        <Wrap spacing={1} mb={2}>
          {searchOptions.majors.map(major => (
            <Tag key={major} size="sm" variant="outline" colorScheme="blue">
              <TagLabel>{major.split('<p>').pop()}</TagLabel>
              <TagCloseButton
                onClick={() =>
                  changeSearchOption(
                    'majors',
                    searchOptions.majors.filter(v => v !== major),
                  )
                }
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
          {allMajors.map(major => (
            <MajorCheckbox key={major} major={major} />
          ))}
        </Stack>
      </CheckboxGroup>
    </FormControl>
  );
};
