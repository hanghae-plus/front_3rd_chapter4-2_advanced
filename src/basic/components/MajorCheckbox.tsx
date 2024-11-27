import { Box, Checkbox } from '@chakra-ui/react';
import { memo } from 'react';

export const MajorCheckbox = memo(
  ({
    major,
    isChecked,
    onChange,
  }: {
    major: string;
    isChecked: boolean;
    onChange: (major: string) => void;
  }) => (
    <Box>
      <Checkbox
        size="sm"
        value={major}
        isChecked={isChecked}
        onChange={() => onChange(major)}
      >
        {major.replace(/<p>/gi, ' ')}
      </Checkbox>
    </Box>
  )
);
