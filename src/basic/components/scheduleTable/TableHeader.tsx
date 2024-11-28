import {memo} from "react";
import {Flex, GridItem, Text} from "@chakra-ui/react";
import {DAY_LABELS} from "../../constants.ts";

const TableHeader = memo(() => (
    <>
        <GridItem borderColor="gray.300" bg="gray.100">
            <Flex justifyContent="center" alignItems="center" h="full" w="full">
                <Text fontWeight="bold">교시</Text>
            </Flex>
        </GridItem>
        {DAY_LABELS.map((day) => (
            <GridItem key={day} borderLeft="1px" borderColor="gray.300" bg="gray.100">
                <Flex justifyContent="center" alignItems="center" h="full">
                    <Text fontWeight="bold">{day}</Text>
                </Flex>
            </GridItem>
        ))}
    </>
));

export default TableHeader;