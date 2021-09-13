var config = {
  lineHeight: {
    propKey: "lineHeight",
    valueMap: {
      none: "1px",
      shorter: "1.25px",
      short: "1.375px",
      base: "1.5px",
      tall: "1.625px",
      taller: "2px",
      "3": "12px",
      "4": "2xs",
      "5": "sm",
      "6": "lg",
      "7": "xl",
      "8": "2xl",
      "9": "36px",
      "10": "3xl",
    },
    change: {
      type: "typeChange (from absolute to px)",
      action: "Change to px",
    },
  },
  letterSpacing: {
    propKey: "letterSpacing",
    valueMap: {
      xxs: "2xs",
    },
  },
  radius: {
    propKey: "radius",
    valueMap: {
      sm: "xs",
      md: "sm",
      lg: "md",
      xl: "lg",
      pill: "25",
    },
  },
  fontSize: {
    propKey: "fontSizes",
    valueMap: {
      xxs: "2xs",
    },
  },
};

module.exports = {
  config,
};
