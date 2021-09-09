import config from "./config.json";
const { setDirtyFile } = require("./utils");

export default (fileInfo, api) => {
  const j = api.jscodeshift;

  const root = j(fileInfo.source);
  const JSXElement = root.find(j.JSXOpeningElement, {
    name: {
      type: "JSXIdentifier",
    },
  });

  const updatedJSXElement = JSXElement.find(j.JSXAttribute, {
    type: "JSXAttribute",
  })
    .replaceWith((nodePath) => {
      const { node } = nodePath;

      if (config[node.name.name]) {
        let propNode = config[node.name.name];

        let nodeValue = node.value;
        let nodeValueType = node.value.type;

        if (node.value.type === "JSXExpressionContainer") {
          nodeValue = node.value.expression;
          nodeValueType = node.value.expression.type;
        }

        let transformedValue;

        if (
          nodeValueType === "NumericLiteral" ||
          nodeValueType === "StringLiteral"
        ) {
          if (propNode["valueMap"] && propNode["valueMap"][nodeValue.value]) {
            transformedValue = propNode["valueMap"][nodeValue.value];
          } else {
            transformedValue = String(nodeValue.value);
          }

          const newNode = j.stringLiteral(transformedValue);
          node.value = newNode;
          setDirtyFile(fileInfo);
        }
      }

      return node;
    })
    .toSource();

  return updatedJSXElement;
};
