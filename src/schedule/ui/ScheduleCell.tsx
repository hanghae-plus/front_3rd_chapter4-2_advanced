import { GridItem } from "@chakra-ui/react";
import { memo } from "react";

export const ScheduleCell = memo(({ 
  index, 
  onClick 
}: { 
  index: number; 
  onClick: () => void;
}) => (
  <GridItem
    borderWidth="1px 0 0 1px"
    borderColor="gray.300"
    bg={index > 17 ? 'gray.100' : 'white'}
    cursor="pointer"
    _hover={{ bg: 'yellow.100' }}
    onClick={onClick}
  />
));