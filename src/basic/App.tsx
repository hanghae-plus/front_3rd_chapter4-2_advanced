import { ChakraProvider } from "@chakra-ui/react";
import { ScheduleProvider } from "./context/ScheduleContext.tsx";
import { ScheduleTables } from "./components/table/ScheduleTables.tsx";
import ScheduleDndProvider from "./context/dnd/ScheduleDndProvider.tsx";

function App() {
  return (
    <ChakraProvider>
      <ScheduleProvider>
        <ScheduleDndProvider>
          <ScheduleTables />
        </ScheduleDndProvider>
      </ScheduleProvider>
    </ChakraProvider>
  );
}

export default App;
