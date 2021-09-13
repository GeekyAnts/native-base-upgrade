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
      hello={22}
      size="12"
      flex={1}
      color="red.200"
      _focus={{
        mt: "121",
        _focus: {
          ml: "121",
        },
        _web: {
          mt: "11",
        },
      }}
    >
      <Text fontSize="md1" mt="222">
        Hello World
      </Text>
    </Box>
  );
};

export default Test;
