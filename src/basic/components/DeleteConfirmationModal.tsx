import {
  Button,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  Text,
} from '@chakra-ui/react';

interface DeleteConfirmationModalProps {
  onDelete: () => void;
}

const DeleteConfirmationModal = ({ onDelete }: DeleteConfirmationModalProps) => (
  <PopoverContent onClick={(event) => event.stopPropagation()}>
    <PopoverArrow />
    <PopoverCloseButton />
    <PopoverBody>
      <Text>강의를 삭제하시겠습니까?</Text>
      <Button colorScheme="red" size="xs" onClick={onDelete}>
        삭제
      </Button>
    </PopoverBody>
  </PopoverContent>
);

export default DeleteConfirmationModal;
