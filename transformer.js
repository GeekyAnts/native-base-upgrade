import config from "./config.json";
const describe = require("jscodeshift-helper").describe;

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
        let value = undefined;

        if (node.value.type === "Literal") {
          value = node.value.value;
        } else if (node.value.type === "JSXExpressionContainer") {
          value = node.value.expression.value;
        }

        if (propNode["valueMap"] && propNode["valueMap"][value]) {
          value = propNode["valueMap"][value];
        } else {
          if (!value.endsWith("px")) value += "px";
        }

        const newNode = j.literal(value);
        node.value = newNode;
      }

      describe(node);
      return node;
    })
    .toSource();

  return updatedJSXElement;
};
