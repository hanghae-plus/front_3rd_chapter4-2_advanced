import { ChakraProvider } from '@chakra-ui/react';
import { ScheduleProvider } from './context/ScheduleContext.tsx';
import { ScheduleTables } from "./ScheduleTables.tsx";
import GlobalDndProvider from "./provider/GlobalDndProvider.tsx";

function App() {

  return (
    <ChakraProvider>
      <ScheduleProvider>
        <GlobalDndProvider>
          <ScheduleTables/>
        </GlobalDndProvider>
      </ScheduleProvider>
    </ChakraProvider>
  );
}

export default App;
