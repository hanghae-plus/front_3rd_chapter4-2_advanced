import { ChakraProvider } from '@chakra-ui/react';
import { ScheduleTables } from "./ScheduleTables.tsx";
import GlobalDndProvider from "./provider/GlobalDndProvider.tsx";
import { Provider } from 'jotai';

function App() {

  return (
    <Provider>
      <ChakraProvider>
         <GlobalDndProvider>
            <ScheduleTables/>
          </GlobalDndProvider>
      </ChakraProvider>
    </Provider>
  );
}

export default App;
