import { NativeBaseProvider } from "native-base";

function App() {
  return (
    <NativeBaseProvider>
      <Box bg="primary.500" p={4} />
      <Box
        lineHeight="19"
        letterSpacing="2xs"
        radius="xs"
        fontSizes="23"
        color="red.200"
      >
        Hello World
      </Box>
      <Box
        lineHeight="19px"
        letterSpacing="2xs"
        radius="xs"
        fontSizes="23px"
        color="red.200"
      >
        Hello World
      </Box>
    </NativeBaseProvider>
  );
}

export default App;
