// Replacing props with type

export default (fileInfo, api) => {
  const j = api.jscodeshift;

  const root = j(fileInfo.source);

  // finding Box
  const Box = root.find(j.JSXOpeningElement, {
    name: {
      type: "JSXIdentifier",
      name: "Box",
    },
  });

  // console.log('MYLOG: Box: ', Box);

  // find bg in Box
  const updatedBox = Box.find(j.JSXAttribute, {
    type: "JSXAttribute",
  })
    .replaceWith((nodePath) => {
      // get the underlying Node
      // console.log('MYLOG: nodePath: ', nodePath);
      const { node } = nodePath;

      console.log("%c &*& node.name.name", "color: #10b981;", node.name.name);
      // console.log('MYLOG: node: ', node);
      if (node.name.name === "lineHeight") {
        node.value.value = "8";
      }

      // change to our new prop
      // node.value.value = 'red.400';
      // replaceWith should return a Node, not a NodePath
      return node;
    })
    .toSource();

  // console.log('MYLOG:Box: ', Box);
  console.log("MYLOG: updatedBox: ", updatedBox);

  return updatedBox;
};
