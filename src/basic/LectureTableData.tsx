import {memo} from "react";
import {Button, Td, Tr} from "@chakra-ui/react";
import {Lecture} from "./types.ts";

interface Props {
    lecture: Lecture;
    onAddButtonClick: (lecture: Lecture) => void;
}

const LectureTableData = memo(({lecture, onAddButtonClick}: Props) =>{
    return(
        <Tr>
            <Td width="100px">{lecture.id}</Td>
            <Td width="50px">{lecture.grade}</Td>
            <Td width="200px">{lecture.title}</Td>
            <Td width="50px">{lecture.credits}</Td>
            <Td width="150px" dangerouslySetInnerHTML={{ __html: lecture.major }}/>
            <Td width="150px" dangerouslySetInnerHTML={{ __html: lecture.schedule }}/>
            <Td width="80px">
                <Button size="sm" colorScheme="green" onClick={() => onAddButtonClick(lecture)}>추가</Button>
            </Td>
        </Tr>
    )
});

export default LectureTableData;