import { Box } from "native-base";

const lineHeight = "8";

const Test = () => {
  return (
    <Box
      lineHeight="12"
      letterSpacing="2xs"
      radius="xs"
      fontSize="2xs"
      mt="121"
      color="red.200"
    >
      <Text fontSize="md1" mt="222">
        Hello World
      </Text>
    </Box>
  );
};

export default Test;
