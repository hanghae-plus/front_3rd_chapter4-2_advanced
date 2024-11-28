import { Flex, GridItem, Text } from "@chakra-ui/react";
import { memo } from "react";
import { fill2 } from "../basic/utils";

export const TimeCell = memo(({ 
  time, 
  index 
}: { 
  time: string; 
  index: number; 
}) => (
  <GridItem
    borderTop="1px solid"
    borderColor="gray.300"
    bg={index > 17 ? 'gray.200' : 'gray.100'}
  >
    <Flex justifyContent="center" alignItems="center" h="full">
      <Text fontSize="xs">{fill2(index + 1)} ({time})</Text>
    </Flex>
  </GridItem>
));