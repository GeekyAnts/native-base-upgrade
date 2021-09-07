const path = require("path");
const fs = require("fs");

const oldThemeObj = {
  lineHeights: {
    none: 1,
    shorter: 1.25,
    short: 1.375,
    base: 1.5,
    tall: 1.625,
    taller: 2,
    3: "12px",
    4: "16px",
    5: "20px",
    6: "24px",
    7: "28px",
    8: "32px",
    9: "36px",
    10: "40px",
  },
  letterSpacings: {
    xxs: -1.5,
    xs: -0.5,
    sm: 0,
    md: 0.1,
    lg: 0.15,
    xl: 0.25,
    "2xl": 0.4,
    "3xl": 0.5,
    "4xl": 1.25,
    "5xl": 1.5,
  },
  fontSizes: {
    xxs: 10,
  },
  radii: {
    sm: 2,
    md: 4,
    lg: 6,
    xl: 8,
    pill: 25,
  },
  borderWidth: {
    none: 0,
  },
};

const setDirtyFile = (fileInfo) => {
  fs.readFile(path.join(__dirname, "temp.txt"), "utf8", function(err, data) {
    if (err) {
      console.error(err);
    }

    if (!data) {
      data = "";
    }

    const content = data + fileInfo.path;
    fs.writeFile(path.join(__dirname, "temp.txt"), content, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
  });
};

const oldTheme = JSON.stringify(oldThemeObj, null, 2);

console.log("hello here");

// exit
export default (fileInfo, api) => {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);
  let extendThemeImport = false;

  modifyExtendTheme();
  modifyProvider();

  function modifyExtendTheme() {
    // extendTheme import
    let localNameExtendTheme = "extendTheme";
    root
      .find(j.ImportDeclaration)
      .filter(
        (impDecNodePath) => impDecNodePath.value.source.value === "native-base"
      )
      .forEach((impDecNodePathFiltered) => {
        j(impDecNodePathFiltered)
          // find ImportSpecifier here instead of Identifier
          .find(j.ImportSpecifier)
          .forEach((impSpecNodePath) => {
            if (impSpecNodePath.node.imported.name === "extendTheme") {
              extendThemeImport = true;

              if (impSpecNodePath.node.local.name) {
                localNameExtendTheme = impSpecNodePath.node.local.name;
              }
            }
          });
      });

    // if extend theme import
    if (extendThemeImport) {
      const callExpression = root.find(j.CallExpression, {
        callee: {
          type: "Identifier",
          name: localNameExtendTheme,
        },
      });

      const callExpressionLength = callExpression.length;
      if (callExpressionLength) {
        // const output = callExpression.find(j.ObjectExpression);

        // .forEach((node) => {
        //     console.log(node);
        //     // node.insertBefore(`${oldTheme}`);
        //   });

        callExpression.find(j.ObjectExpression).filter((node, index) => {
          if (
            node.parent.value.type === "CallExpression" &&
            node.parent.value.callee.name === localNameExtendTheme &&
            index === 0
          ) {
            node.insertBefore(`${oldTheme}`);
            setDirtyFile(fileInfo);
          }
        });
      }
    }
  }
  function modifyProvider() {
    const nativeBaseProviderJSX = root.find(j.JSXOpeningElement, {
      name: {
        type: "JSXIdentifier",
        name: "NativeBaseProvider",
      },
    });

    if (nativeBaseProviderJSX.length === 0) {
      return;
    }

    const themeAttribute = nativeBaseProviderJSX.find(j.JSXAttribute, {
      name: { name: "theme" },
    });

    if (themeAttribute.length === 0) {
      //import extend theme

      addImportExtendTheme();

      //

      const imports = root.find(j.ImportDeclaration);
      const lastImport = imports.at(imports.length - 1).get();
      lastImport.insertAfter(`const theme_v3 = extendTheme(${oldTheme});
      `);

      nativeBaseProviderJSX.replaceWith(
        `<NativeBaseProvider theme={theme_v3}>`
      );

      setDirtyFile(fileInfo);
    } else {
      // if empty theme
      // const themeAttrNode = themeAttribute.nodes()[0];
      // if (
      //   themeAttrNode &&
      //   themeAttrNode.value.type === "JSXExpressionContainer"
      // ) {
      //   if (themeAttrNode.value.expression?.type === "Identifier") {
      //     // no need to change anything
      //   } else {
      //   }
      // }
      // themeAttribute.replaceWith(
      //   `theme={extendTheme(${oldTheme})}>`
      // );
    }
    //   // and not theme

    //   nativeBaseProviderAttribute.insertBefore(
    //     `theme={extendTheme(${oldTheme})}`
    //   );
    // }
  }

  function addImportExtendTheme() {
    if (!extendThemeImport) {
      root
        .find(j.ImportDeclaration)
        .get()
        .insertBefore('import {extendTheme} from "native-base";');
    }
  }
  return root.toSource();
};
