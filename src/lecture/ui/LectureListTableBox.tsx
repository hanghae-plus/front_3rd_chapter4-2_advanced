import { memo, RefObject } from "react";
import { Lecture } from "../../basic/types";
import { Box, Table, Thead, Tr, Th, Tbody } from "@chakra-ui/react";
import { LectureTableRow } from "./LectureTableRow";

interface LectureListTableBoxProps {
  lectures: Lecture[];
  onAddLecture: (lecture: Lecture) => void;
  loaderRef: RefObject<HTMLDivElement>;
  wrapperRef: RefObject<HTMLDivElement>;
}

export const LectureListTableBox = memo(({ lectures, onAddLecture, loaderRef, wrapperRef }: LectureListTableBoxProps) => (
  <Box>
    <Table>
      <Thead>
        <Tr>
          <Th width="100px">과목코드</Th>
          <Th width="50px">학년</Th>
          <Th width="200px">과목명</Th>
          <Th width="50px">학점</Th>
          <Th width="150px">전공</Th>
          <Th width="150px">시간</Th>
          <Th width="80px"></Th>
        </Tr>
      </Thead>
    </Table>

    <Box overflowY="auto" maxH="500px" ref={wrapperRef}>
      <Table size="sm" variant="striped">
        <Tbody>
          {lectures.map((lecture, index) => (
            <LectureTableRow 
              key={`${lecture.id}-${index}`}
              lecture={lecture}
              onAddSchedule={onAddLecture}
            />
          ))}
        </Tbody>
      </Table>
      <Box ref={loaderRef} h="20px"/>
    </Box>
  </Box>
));