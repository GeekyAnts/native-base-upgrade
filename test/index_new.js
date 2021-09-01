import { Box } from "native-base";
const props = {
  lineHeight: "12",
};

const Test = () => {
  return (
    <Box lineHeight={lineHeight} {...props}>
      Hello World
    </Box>
  );
};

export default Test;
