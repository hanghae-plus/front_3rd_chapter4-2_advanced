import { Tr, Td, Button, Table, Tbody } from "@chakra-ui/react";
import { memo } from "react";
import { Lecture } from "../basic/types";

interface LectureListProps {
  lectures: Lecture[];
  onAddLecture: (lecture: Lecture) => void;
}

const LectureRow = memo(
  ({
    lecture,
    onAdd,
  }: {
    lecture: Lecture;
    onAdd: (lecture: Lecture) => void;
  }) => (
    <Tr>
      <Td width="100px">{lecture.id}</Td>
      <Td width="50px">{lecture.grade}</Td>
      <Td width="200px">{lecture.title}</Td>
      <Td width="50px">{lecture.credits}</Td>
      <Td width="150px" dangerouslySetInnerHTML={{ __html: lecture.major }} />
      <Td
        width="150px"
        dangerouslySetInnerHTML={{ __html: lecture.schedule }}
      />
      <Td width="80px">
        <Button size="sm" colorScheme="green" onClick={() => onAdd(lecture)}>
          추가
        </Button>
      </Td>
    </Tr>
  )
);

export const LectureList = memo(
  ({ lectures, onAddLecture }: LectureListProps) => (
    <Table size="sm" variant="striped">
      <Tbody>
        {lectures.map((lecture, index) => (
          <LectureRow
            key={`${lecture.id}-${index}`}
            lecture={lecture}
            onAdd={onAddLecture}
          />
        ))}
      </Tbody>
    </Table>
  )
);
