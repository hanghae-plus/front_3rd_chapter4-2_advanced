import { Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import { Fragment, memo } from "react";
import { CellSize, DAY_LABELS, TIMES } from "../../constants";
import { DayCell, HeaderCell, TimeCell } from "./TableCells";

export const TableHeader = memo(() => (
  <>
    <GridItem key="교시" borderColor="gray.300" bg="gray.100">
      <Flex justifyContent="center" alignItems="center" h="full" w="full">
        <Text fontWeight="bold">교시</Text>
      </Flex>
    </GridItem>
    {DAY_LABELS.map((day) => (
      <HeaderCell key={day} day={day} />
    ))}
  </>
));

export const TableGrid = memo(
  ({
    onScheduleTimeClick,
  }: {
    onScheduleTimeClick?: (info: { day: string; time: number }) => void;
  }) => {
    return (
      <Grid
        templateColumns={`120px repeat(${DAY_LABELS.length}, ${CellSize.WIDTH}px)`}
        templateRows={`40px repeat(${TIMES.length}, ${CellSize.HEIGHT}px)`}
        bg="white"
        fontSize="sm"
        textAlign="center"
        outline="1px solid"
        outlineColor="gray.300"
      >
        <TableHeader />
        {TIMES.map((time, timeIndex) => (
          <Fragment key={`시간-${timeIndex + 1}`}>
            <TimeCell time={time} timeIndex={timeIndex} />
            {DAY_LABELS.map((day) => (
              <DayCell
                key={`${day}-${timeIndex + 2}`}
                day={day}
                timeIndex={timeIndex}
                onScheduleTimeClick={onScheduleTimeClick}
              />
            ))}
          </Fragment>
        ))}
      </Grid>
    );
  }
);