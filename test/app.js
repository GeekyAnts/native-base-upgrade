import { extendTheme } from "native-base";

import { NativeBaseProvider } from "native-base";

const theme_v3 = extendTheme({ config });

function App() {
  return (
    <NativeBaseProvider theme={theme_v3}>
      <Box bg="primary.500" p={4} />
    </NativeBaseProvider>
  );
}

export default App;
