import {
  Button,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  Text,
} from '@chakra-ui/react';
import { memo } from "react";

export const ScheduleDeletePopoverContent = memo(({
  onDeleteButtonClick
} : {
  onDeleteButtonClick: () => void 
}) => (
  <PopoverContent onClick={event => event.stopPropagation()}>
    <PopoverArrow/>
    <PopoverCloseButton/>
    <PopoverBody>
      <Text>강의를 삭제하시겠습니까?</Text>
      <Button colorScheme="red" size="xs" onClick={onDeleteButtonClick}>
        삭제
      </Button>
    </PopoverBody>
    </PopoverContent>
));