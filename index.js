#! /usr/bin/env node

var prompts = require("prompts");
const { nextVersions } = require("./next-versions");
const fs = require("fs");
const path = require("path");
const semver = require("semver");
const chalk = require("chalk");
var shell = require("shelljs");
var exec = shell.exec;
const projectWorkingDirectory = process.cwd();

async function getCurrentVersion() {
  return new Promise((resolve, reject) => {
    exec(
      `npx npm ls native-base`,
      { cwd: projectWorkingDirectory, silent: true },
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
      exec(
        yarnAddCommand,
        { cwd: projectWorkingDirectory, silent: true },
        (err, stdout) => {
          if (err) {
            console.log(err);

            console.log(
              `\n${chalk.yellow(`${chalk.bold(yarnAddCommand)} failed!`)}`
            );
            reject(err);
          }
          console.log(stdout);
          resolve();
        }
      );
    } else {
      //
      const npmInstallCommand = `npm install native-base@${nextVersion}`;

      exec(
        npmInstallCommand,
        { cwd: projectWorkingDirectory, silent: true },
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
      `node ${__dirname}/node_modules/.bin/jscodeshift --ignore-pattern="**/node_modules/**" --extensions="ts, tsx, js, jsx" -t ${__dirname}/extend-theme-transformer-v3.js ${srcPath}`,
      { silent: true },
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

function printSuccessMessage(nextVersion) {
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

async function checkGitAvailable() {
  return new Promise((resolve, reject) => {
    exec(
      `git rev-parse --is-inside-work-tree`,
      { cwd: projectWorkingDirectory, silent: true },
      (err, stdout) => {
        if (err) {
          reject();
        }
        resolve(true);
      }
    );
  });
  //git rev-parse --is-inside-work-tree
}
// main

async function fetchUserCurrentVersion() {
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
    process.exit(0);
    // return fetchUserCurrentVersion();
  } else {
    return response.value;
  }
}

try {
  (async () => {
    cleanTemp();
    let currentVersion;
    let gitAvailable = false;

    try {
      currentVersion = await getCurrentVersion();
    } catch (err) {
      console.log(
        chalk.red(`Failed to fetch your current version of native-base!`)
      );
      currentVersion = await fetchUserCurrentVersion();
    }

    try {
      gitAvailable = await checkGitAvailable();
    } catch (err) {
      //
    }

    const nextVersion = getNextUpgradableVersion(currentVersion);

    if (!gitAvailable) {
      console.log(
        chalk.yellow(
          `We couldn't find a git repository in your project directory.\nIt's recommended to back up your project before proceeding.`
        )
      );
    } else {
      console.log(
        chalk.yellow(
          `It's recommended to commit all your changes before proceeding, so you can revert the changes made by this command if necessary.`
        )
      );
    }

    const continueResponse = await prompts({
      type: "confirm",
      name: "value",
      message: `Do you want continue?`,
      initial: true,
    });

    if (!continueResponse.value) {
      process.exit(0);
    }

    console.log(chalk.bold(`Current Version: `) + chalk.green(currentVersion));

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
    }

    const updgradableVersions = [];

    const response = await prompts({
      type: "confirm",
      name: "value",
      message: `Upgrade to ${chalk.cyan(
        nextVersion
      )} using codemod, Can you confirm?`,
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
        message: `Relative path to your source folder (${chalk.yellow(
          "node_modules will be ignored"
        )}) (e.g, ${chalk.gray("src/")}, ${chalk.gray(".")})`,
        initial: "",
      });

      await updateNativeBaseVersion(packageManager.value, nextVersion);
      await updateFiles(path.join(projectWorkingDirectory, response.value));

      printSuccessMessage(nextVersion);
    }
  })();
} catch (err) {
  console.log(chalk.red(err));
  console.log(chalk.red("\nUnable to run codemod!"));
  process.exit(1);
}
