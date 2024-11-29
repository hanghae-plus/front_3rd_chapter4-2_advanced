import { ChakraProvider } from '@chakra-ui/react';
import { ScheduleTables } from './components/ScheduleTables.tsx';
import { ScheduleProvider } from './contexts/ScheduleContext.tsx';
import ScheduleDndProvider from './contexts/ScheduleDndProvider.tsx';

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
