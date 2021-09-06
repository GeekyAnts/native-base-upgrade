#! /usr/bin/env node

const { exec, execSync } = require("child_process");
var prompts = require("prompts");
const { nextVersions } = require("./next-versions");
const fs = require("fs");
const path = require("path");
const semver = require("semver");
const chalk = require("chalk");

const projectWorkingDirectory = process.cwd();

async function getCurrentVersion() {
  return new Promise((resolve, reject) => {
    exec(
      `cd ${projectWorkingDirectory} && npx npm ls native-base`,
      (err, stdout) => {
        if (err) {
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
      const yarnAddCommand = `yarn add native-base@${nextVersion}`;
      exec(yarnAddCommand, { cwd: projectWorkingDirectory }, (err, stdout) => {
        if (err) {
          console.log(err);

          console.log(
            `\n${chalk.yellow(`${chalk.bold(yarnAddCommand)} failed!`)}`
          );
          reject(err);
        }
        console.log(stdout);
        resolve();
      });
    } else {
      //
      const npmInstallCommand = `npm install native-base@${nextVersion}`;

      exec(
        npmInstallCommand,
        { cwd: projectWorkingDirectory },
        (err, stdout) => {
          if (err) {
            console.log(err);
            console.log(
              `\n${chalk.yellow(`${chalk.bold(npmInstallCommand)} failed!`)}`
            );
            return;
          }
          console.log(stdout);
          resolve();
        }
      );
    }
  });
}

async function updateFiles(srcPath) {
  return new Promise((resolve, reject) => {
    exec(
      `node ${__dirname}/node_modules/.bin/jscodeshift --ignore-pattern="**/node_modules/**" -t ${__dirname}/extend-theme-transformer-v3.js ${srcPath}`,
      (err, stdout) => {
        if (err) {
          console.log("Error: ", err);
          reject(err);
        }
        // console.log(stdout);
        resolve();
      }
    );
  });
}

function getNextUpgradableVersion(currentVersion) {
  return nextVersions[currentVersion];
}

function cleanTemp() {
  fs.writeFile(path.join(__dirname, "temp.txt"), "", (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
}

(async () => {
  cleanTemp();
  let currentVersion;
  try {
    currentVersion = await getCurrentVersion();
  } catch (err) {
    console.log(
      chalk.red(`Failed to fetch your current version of native-base!`)
    );

    const response = await prompts({
      type: "text",
      name: "value",
      message: `Enter your native-base version (e.g, ${chalk.gray("3.0.7")})`,
      initial: "",
    });

    if (
      !response.value ||
      !semver.valid(response.value) // '1.2.3'
    ) {
      console.log(chalk.red(`Invalid version! Please try again!`));
      process.exit(1);
    } else {
      currentVersion = response.value;
    }
  }

  const nextVersion = getNextUpgradableVersion(currentVersion);
  console.log(chalk.bold(`Current Version: `) + chalk.green(currentVersion));

  // no version available on npm

  // no code mode available

  // available
  if (!nextVersion) {
    console.warn(
      chalk.yellow(`No codemod available to for v${currentVersion}`)
    );

    const response = await prompts({
      type: "confirm",
      name: "value",
      message: `Do you want to upgrade native-base to latest version?`,
      initial: true,
    });

    if (response.value === true) {
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
      await updateNativeBaseVersion(packageManager.value, "latest");
    }

    process.exit(0);

    //   // var keys = [];
    //   // for (var k in nextVersions) keys.push(k);
    //   // console.warn("");
    //   // console.warn("Available versions for upgrade: " + keys);
    //   // console.warn(
    //   //   "Upgrade native-base manually to any above version to run this script!"
    //   // );
  }

  const updgradableVersions = [];

  const response = await prompts({
    type: "confirm",
    name: "value",
    message: `Upgrade to ${nextVersion} using codemod, Can you confirm?`,
    initial: true,
  });

  if (response.value === true) {
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

    const response = await prompts({
      type: "text",
      name: "value",
      message: `Enter the relative path to your source folder (e.g, ${chalk.gray(
        "src/"
      )}, ${chalk.gray(".")})`,
      initial: "",
    });

    await updateNativeBaseVersion(packageManager.value, nextVersion);
    await updateFiles(path.join(projectWorkingDirectory, response.value));

    fs.readFile(path.join(__dirname, "temp.txt"), (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(
        chalk.bold(`native-base upgraded to ` + chalk.green(nextVersion))
      );

      console.log(chalk.bold("\nModified files: "));
      console.log(chalk.cyan(data.toString()));

      console.log(
        chalk.yellow(
          `\nIt is recommended for you to verify the changes made to these files by the codemod. Happy coding!`
        )
      );
    });
  }
})();
