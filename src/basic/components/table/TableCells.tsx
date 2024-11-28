import { Flex, GridItem, Text } from "@chakra-ui/react";
import { memo } from "react";
import { fill2 } from "../../lib/utils/timeUtils";

export const TimeCell = memo(
  ({ time, timeIndex }: { time: string; timeIndex: number }) => (
    <GridItem
      borderTop="1px solid"
      borderColor="gray.300"
      bg={timeIndex > 17 ? "gray.200" : "gray.100"}
    >
      <Flex justifyContent="center" alignItems="center" h="full">
        <Text fontSize="xs">
          {fill2(timeIndex + 1)} ({time})
        </Text>
      </Flex>
    </GridItem>
  )
);

export const DayCell = memo(
  ({
    day,
    timeIndex,
    onScheduleTimeClick,
  }: {
    day: string;
    timeIndex: number;
    onScheduleTimeClick?: (info: { day: string; time: number }) => void;
  }) => (
    <GridItem
      borderWidth="1px 0 0 1px"
      borderColor="gray.300"
      bg={timeIndex > 17 ? "gray.100" : "white"}
      cursor="pointer"
      _hover={{ bg: "yellow.100" }}
      onClick={() => onScheduleTimeClick?.({ day, time: timeIndex + 1 })}
    />
  )
);

export const HeaderCell = memo(({ day }: { day: string }) => (
  <GridItem borderLeft="1px" borderColor="gray.300" bg="gray.100">
    <Flex justifyContent="center" alignItems="center" h="full">
      <Text fontWeight="bold">{day}</Text>
    </Flex>
  </GridItem>
));