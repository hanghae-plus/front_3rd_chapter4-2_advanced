import React, { memo } from 'react';
import { Box, Button, Text } from '@chakra-ui/react';
import { Lecture } from '../types';

interface Props {
  lecture: Lecture;
  addSchedule: (lecture: Lecture) => void;
  style: React.CSSProperties;
}

const LectureRow = memo(({ lecture, addSchedule, style }: Props) => {
  return (
    <Box
      style={style}
      display="flex"
      alignItems="center"
      borderBottom="1px solid #e2e8f0"
      paddingY="8px"
    >
      <Box width="100px"><Text>{lecture.id}</Text></Box>
      <Box width="50px"><Text>{lecture.grade}</Text></Box>
      <Box width="200px"><Text>{lecture.title}</Text></Box>
      <Box width="50px"><Text>{lecture.credits}</Text></Box>
      <Box width="150px" dangerouslySetInnerHTML={{ __html: lecture.major }} />
      <Box width="150px" dangerouslySetInnerHTML={{ __html: lecture.schedule }} />
      <Box width="80px">
        <Button size="sm" colorScheme="green" onClick={() => addSchedule(lecture)}>
          추가
        </Button>
      </Box>
    </Box>
  );
});

export default LectureRow;
