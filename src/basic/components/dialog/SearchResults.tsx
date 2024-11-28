import { Box, Table, Tbody, Th, Thead, Tr } from "@chakra-ui/react";
import { forwardRef, memo } from "react";

interface SearchResultsProps {
  renderedRows: React.ReactNode;
  loaderRef: React.RefObject<HTMLDivElement>;
  loaderWrapperRef: React.RefObject<HTMLDivElement>;
}

export const SearchResults = memo(
  forwardRef<HTMLDivElement, SearchResultsProps>(({ renderedRows, loaderRef, loaderWrapperRef }) => {
  return (
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

      <Box overflowY="auto" maxH="500px" ref={loaderWrapperRef}>
        <Table size="sm" variant="striped">
          <Tbody>{renderedRows}</Tbody>
        </Table>
        <Box ref={loaderRef} h="20px" />
      </Box>
    </Box>
  )
}))

SearchResults.displayName = "SearchResults";