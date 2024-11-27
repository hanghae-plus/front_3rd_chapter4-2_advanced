import React, { memo } from 'react';
import { Tr, Td, Button, HStack, Box,Text} from '@chakra-ui/react';
import { Lecture } from '../types';

interface Props {
  lecture: Lecture
  style: any
  addSchedule: (lecture:Lecture) => void;
}

const LectureRow = memo(({ lecture, addSchedule ,style}:Props) => {
  return (
    <HStack style={style} key={lecture.id} spacing={4} borderBottom="1px solid #e2e8f0" py={2}>
      <Box width="100px"><Text>{lecture.id}</Text></Box>
      <Box width="50px"><Text>{lecture.grade}</Text></Box>
      <Box width="200px"><Text>{lecture.title}</Text></Box>
      <Box width="50px"><Text>{lecture.credits}</Text></Box>
      <Box width="150px" dangerouslySetInnerHTML={{ __html: lecture.major }} />
      <Box width="150px" dangerouslySetInnerHTML={{ __html: lecture.schedule }} />
      <Box width="80px">
        <Button size="sm" colorScheme="green" onClick={() => addSchedule(lecture)}>추가</Button>
      </Box>
    </HStack>
  );
});

export default LectureRow;