// Replacing props with type

export default (fileInfo, api) => {
  const j = api.jscodeshift;

  const root = j(fileInfo.source);

  // // finding Box
  // const Box = root.find(j.callExpression,
  //   j.identifier('foo'),
  // });

  // check import
  const callExpression = root.find(j.CallExpression, {
    callee: {
      type: "Identifier",
      name: "extendTheme",
    },
  });

  const extendThemeArgument = callExpression.find(j.ObjectExpression);

  console.log(extendThemeArgument);

  extendThemeArgument
    .find(j.ObjectExpression) // Find a list of object literals
    .forEach((obj) => {
  //     console.log(obj.value.properties);

  //     // obj.value.properties.forEach((property) => {
  //     //   console.log(property.key.name, "obje here");

  //     //   //   // … go through each property …
  //     //   //   // if (property.type !== 'Property') return;
  //     //   //   // if (property.key.name !== 'promise') return;
  //     //   //   // // … and if the key is 'promise', change it to 'request'
  //     //   //   // property.key.name = 'request';
      });
    });

  // extendThemeArgument.properties.forEach((property) => {
  //   console.log(property);
  // });
  // // console.log('MYLOG: Box: ', Box);

  // // find bg in Box
  // const updatedBox = Box.find(j.JSXAttribute, {
  //   type: "JSXAttribute",
  // })
  //   .replaceWith((nodePath) => {
  //     // get the underlying Node
  //     // console.log('MYLOG: nodePath: ', nodePath);
  //     const { node } = nodePath;

  //     console.log("%c &*& node.name.name", "color: #10b981;", node.name.name);
  //     if (node.name.name === "lineHeight") {
  //       // node.value.value = "8";
  //       node.value.expression.value = "8";
  //       node.value.expression.raw = "8";
  //       console.log("MYLOG: node: ", node);
  //     }

  //     // change to our new prop
  //     // node.value.value = 'red.400';
  //     // replaceWith should return a Node, not a NodePath
  //     return node;
  //   })
  //   .toSource();

  // // console.log('MYLOG:Box: ', Box);
  // console.log("MYLOG: updatedBox: ", updatedBox);

  // return updatedBox;
};
