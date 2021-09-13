const { config } = require("./config");
const { setDirtyFile } = require("./utils");

function transformObject(j, fileInfo, nodeValue) {
  nodeValue.properties.forEach((prop) => {
    let propNode = config[prop.key.name];
    let propValue = prop.value;

    // for pseudo props
    if (propNode || prop.key.name.startsWith("_")) {
      if (
        prop.value.type === "NumericLiteral" ||
        prop.value.type === "StringLiteral"
      ) {
        let transformedValue;

        if (
          propNode &&
          propNode["valueMap"] &&
          propNode["valueMap"][propValue.value]
        ) {
          transformedValue = propNode["valueMap"][propValue.value];
        } else {
          transformedValue = String(propValue.value);
        }

        const newNode = j.stringLiteral(transformedValue);
        prop.value = newNode;
        setDirtyFile(fileInfo);
      } else if (prop.value.type === "ObjectExpression") {
        transformObject(j, fileInfo, prop.value);
      }
    }
  });
}
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
      let propNode = config[node.name.name];

      // for pseudo props

      if (propNode || node.name.name.startsWith("_")) {
        let nodeValue = node.value;

        if (nodeValue) {
          let nodeValueType = nodeValue.type;

          if (nodeValue.type === "JSXExpressionContainer") {
            nodeValue = node.value.expression;
            nodeValueType = node.value.expression.type;
          }
          let transformedValue;

          if (
            nodeValueType === "NumericLiteral" ||
            nodeValueType === "StringLiteral"
          ) {
            if (
              propNode &&
              propNode["valueMap"] &&
              propNode["valueMap"][nodeValue.value]
            ) {
              transformedValue = propNode["valueMap"][nodeValue.value];
            } else {
              transformedValue = String(nodeValue.value);
            }

            const newNode = j.stringLiteral(transformedValue);
            node.value = newNode;
            setDirtyFile(fileInfo);
          } else if (nodeValue.type === "ObjectExpression") {
            transformObject(j, fileInfo, nodeValue);
          }
        }
      }

      return node;
    })
    .toSource();

  return updatedJSXElement;
};
