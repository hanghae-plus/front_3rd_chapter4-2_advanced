import { Flex, GridItem, Text } from "@chakra-ui/react";
import { memo } from "react";

interface Props {
	day: string;
}

const DayItem = memo(({ day }: Props) => {
	return (
		<GridItem key={day} borderLeft="1px" borderColor="gray.300" bg="gray.100">
			<Flex justifyContent="center" alignItems="center" h="full">
				<Text fontWeight="bold">{day}</Text>
			</Flex>
		</GridItem>
	);
});
export default DayItem;
