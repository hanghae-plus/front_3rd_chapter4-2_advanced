import { memo } from "react";
import { Lecture } from "../../basic/types";
import { Button, Td, Tr } from "@chakra-ui/react";

export const LectureTableRow = memo(({ 
  lecture, 
  onAddSchedule 
}: { 
  lecture: Lecture, 
  onAddSchedule: (lecture: Lecture) => void 
}) => (
  <Tr>
    <Td width="100px">{lecture.id}</Td>
    <Td width="50px">{lecture.grade}</Td>
    <Td width="200px">{lecture.title}</Td>
    <Td width="50px">{lecture.credits}</Td>
    <Td width="150px" dangerouslySetInnerHTML={{ __html: lecture.major }}/>
    <Td width="150px" dangerouslySetInnerHTML={{ __html: lecture.schedule }}/>
    <Td width="80px">
      <Button size="sm" colorScheme="green" onClick={() => onAddSchedule(lecture)}>
        추가
      </Button>
    </Td>
  </Tr>
));