import { Button, Td, Tr } from '@chakra-ui/react';
import { memo } from 'react';
import { Lecture } from '../../../type/types.ts';

const LectureList = memo(
  ({
    lecture,
    addSchedule,
    index,
  }: {
    lecture: Lecture;
    addSchedule: (lecture: Lecture) => void;
    index: number;
  }) => {
    return (
      <Tr key={`${lecture.id}-${index}`}>
        <Td width="100px">{lecture.id}</Td>
        <Td width="50px">{lecture.grade}</Td>
        <Td width="200px">{lecture.title}</Td>
        <Td width="50px">{lecture.credits}</Td>
        <Td width="150px" dangerouslySetInnerHTML={{ __html: lecture.major }} />
        <Td width="150px" dangerouslySetInnerHTML={{ __html: lecture.schedule }} />
        <Td width="80px">
          <Button size="sm" colorScheme="green" onClick={() => addSchedule(lecture)}>
            추가
          </Button>
        </Td>
      </Tr>
    );
  }
);

export default LectureList;
