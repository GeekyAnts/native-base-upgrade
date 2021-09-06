#! /usr/bin/env node

const { exec, execSync } = require("child_process");
var prompts = require("prompts");
const { nextVersions } = require("./next-versions");

const projectWorkingDirectory = process.cwd();
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

// console.log(__dirname, "hello dir", process.cwd());
async function getCurrentVersion() {
  // var pjson = require(path + "package.json");

  return new Promise((resolve, reject) => {
    console.log(projectWorkingDirectory);
    exec(
      `cd ${projectWorkingDirectory} && npx npm ls native-base`,
      (err, stdout) => {
        if (err) {
          console.log("Error: ", err);
          reject(err);
        }

        const output = stdout.trim();
        const currentVersion = output.slice(output.lastIndexOf("@") + 1);
        resolve(currentVersion);
      }
    );
  });
}

async function updateNativeBaseVersion(packageManager, nextVersion) {
  return new Promise((resolve, reject) => {
    if (packageManager === "yarn") {
      //
      exec(
        `yarn add --modules-folder ${projectWorkingDirectory}/node_modules native-base@${nextVersion}`,
        (err, stdout) => {
          if (err) {
            console.log("Error: ", err);
            reject(err);
          }
          console.log(stdout);
          console.log("Updated native-base");

          resolve();
        }
      );
    } else {
      //
      exec(
        `npm install --prefix ${projectWorkingDirectory} native-base@${nextVersion}`,
        (err, stdout) => {
          if (err) {
            console.log("Error: ", err);
            return;
          }
          console.log(stdout);
          console.log("Updated native-base");
          resolve();
        }
      );
    }
  });
}

async function updateFiles(srcPath) {
  return new Promise((resolve, reject) => {
    exec(
      `node ${__dirname}/node_modules/.bin/jscodeshift -t ${__dirname}/extend-theme-transformer-v3.js ${srcPath}`,
      (err, stdout) => {
        if (err) {
          console.log("Error: ", err);
          reject(err);
        }
        console.log(stdout);
        resolve();
      }
    );
  });
}

function getNextUpgradableVersion(currentVersion) {
  return nextVersions[currentVersion];
}

(async () => {
  const currentVersion = await getCurrentVersion();
  const nextVersion = getNextUpgradableVersion(currentVersion);
  console.log(`Current Version: ${currentVersion}`);

  if (!nextVersion) {
    console.warn("No version to upgrade!");
    process.exit();
  }

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
      initial: "src/",
    });

    await updateNativeBaseVersion(packageManager.value, nextVersion);

    console.log(projectWorkingDirectory, response.value);
    await updateFiles(projectWorkingDirectory + "/" + response.value);

    console.log("Files updated");
  }
})();
