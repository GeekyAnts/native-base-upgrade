#! /usr/bin/env node

const { exec, execSync } = require("child_process");
var prompts = require("prompts");

// exec("npx jscodeshift -t ./transformer.js ./test/index.js", (err, stdout) => {
//   if (err) {
//     console.error(err);
//     return;
//   }
//   console.log(stdout);
// });

// exec(
//   "node ./node_modules/.bin/jscodeshift -t ./extend-theme-transformer-v3.js ./test/index.js",
//   (err, stdout) => {
//     if (err) {
//       console.error(err);
//       return;
//     }
//     console.log(stdout);
//   }
// );

// process.exit(0);

// /
function getCurrentVersion(path = "./") {
  var pjson = require(path + "package.json");
  return;
}

function getNextUpgradableVersion(currentVersion) {
  // return undefined;
  return "3.2.0-alpha.3";
}

// const currentVersion = getCurrentVersion(__dirname + "/../NativeBase/");
const currentVersion = "3.1.0";
const nextVersion = getNextUpgradableVersion(currentVersion);

if (!nextVersion) {
  console.warn("No version to upgrade!\n");
}

(async () => {
  const updgradableVersions = [];

  const response = await prompts({
    type: "confirm",
    name: "value",
    message: `Upgrade to ${nextVersion}, Can you confirm?`,
    initial: true,
  });

  const packageManager = await prompts({
    type: "select",
    name: "value",
    message: "Update native-base using ",
    choices: [
      {
        title: "yarn",
        value: "yarn",
      },
      { title: "npm", value: "npm" },
    ],
    initial: 0,
  });

  if (response.value === true) {
    const response = await prompts({
      type: "text",
      name: "value",
      message: `What's your src/ location?`,
      initial: "./",
    });

    // if (packageManager.value === "yarn") {
    //   //
    //   execSync(`yarn add native-base@${nextVersion}`, (err, stdout) => {
    //     if (err) {
    //       console.log("Error: ", err);

    //       return;
    //     }
    //     console.log(stdout);
    //     console.log("Updated native-base");
    //   });
    // } else {
    //   //
    //   execSync(`npm install native-base@${nextVersion}`, (err, stdout) => {
    //     if (err) {
    //       console.log("Error: ", err);
    //       return;
    //     }
    //     console.log(stdout);
    //     console.log("Updated native-base");
    //   });
    // }

    exec(
      "node ./node_modules/.bin/jscodeshift -t ./extend-theme-transformer-v3.js ./test",
      (err, stdout) => {
        console.log("hello 111");

        if (err) {
          console.log("Error: ", err);
          return;
        }
        console.log(stdout);
        console.log("Files updated");
      }
    );
  }
})();
