// Replacing props with type

const lineHeightTransformMap = {
  none: "2xs",
  shorter: "sm",
  short: "md",
  base: "lg",
  tall: 26,
  taller: "2xl",
  "3": 12,
  "4": "2xs",
  "5": "sm",
  "6": "lg",
  "7": "xl",
  "8": "2xl",
  "9": 36,
  "10": "3xl",
};

const convertAbsoluteToRem = (px) => {
  return `${px / baseFontSize}rem`;
};

const convertRemToAbsolute = (rem) => {
  return rem * baseFontSize;
};

const getAbsoluteValue = (value) => {
  const numberRegex = /^\d+$/;
  const isAbsolute = numberRegex.test(value);
  const isPx = !isAbsolute && value.endsWith("px");
  const isRem = !isAbsolute && value.endsWith("rem");
  const isEm = !isAbsolute && value.endsWith("em");
  const isPercent = !isAbsolute && value.endsWith("%");
  let finalValue = value;

  if (isAbsolute) {
    finalValue = value + "px";
  }

  return finalValue;
};
