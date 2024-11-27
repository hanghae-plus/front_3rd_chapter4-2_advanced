import { ChakraProvider } from '@chakra-ui/react';
import { ScheduleProvider } from './ScheduleContext.tsx';
import { ScheduleTables } from "./ScheduleTables.tsx";
import ScheduleDndProvider from "./ScheduleDndProvider.tsx";
import { MajorsProvider } from './context/MajorsContext.tsx';

function App() {

  return (
    <ChakraProvider>
      <MajorsProvider>
        <ScheduleProvider>
          <ScheduleDndProvider>
            <ScheduleTables/>
          </ScheduleDndProvider>
        </ScheduleProvider>
      </MajorsProvider>
    </ChakraProvider>
  );
}

export default App;
