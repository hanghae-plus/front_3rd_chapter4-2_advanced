import { Button, ButtonGroup, Flex, Heading } from '@chakra-ui/react';
import { memo, useCallback } from 'react';

interface TableHeaderProps {
  index: number;
  tableId: string;
  disabledRemoveButton: boolean;
  onSearchClick: () => void;
  onDuplicateClick: () => void;
  onRemoveClick: () => void;
}

const TableHeader = memo(
  ({
    index,
    tableId,
    disabledRemoveButton,
    onSearchClick,
    onDuplicateClick,
    onRemoveClick,
  }: TableHeaderProps) => {
    const handleSearchClick = useCallback(() => {
      onSearchClick();
    }, [onSearchClick]);

    const handleDuplicateClick = useCallback(() => {
      onDuplicateClick();
    }, [onDuplicateClick]);

    const handleRemoveClick = useCallback(() => {
      onRemoveClick();
    }, [onRemoveClick]);

    return (
      <Flex justifyContent="space-between" alignItems="center">
        <Heading as="h3" fontSize="lg">
          시간표 {index + 1}
        </Heading>
        <ButtonGroup size="sm" isAttached>
          <Button colorScheme="green" onClick={handleSearchClick}>
            시간표 추가
          </Button>
          <Button colorScheme="green" mx="1px" onClick={handleDuplicateClick}>
            복제
          </Button>
          <Button colorScheme="green" isDisabled={disabledRemoveButton} onClick={handleRemoveClick}>
            삭제
          </Button>
        </ButtonGroup>
      </Flex>
    );
  }
);

export default TableHeader;
