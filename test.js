const { stdout } = require("process");
var shell = require("shelljs");

var exec = shell.exec;

exec(
  `node /Users/suraj/Sites/projects/nativebase-codemod/node_modules/.bin/jscodeshift --ignore-pattern="**/node_modules/**" --extensions="js,jsx,ts,tsx" --parser="tsx" -t /Users/suraj/Sites/projects/nativebase-codemod/transformer.js /Users/suraj/Sites/projects/nativebase-codemod/test`,
  { silent: silent },
  (err, stdout) => {
    if (err) {
      console.log("Error: ", err);
    }
  }

  console.log(stdout)
);
