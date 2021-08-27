#! /usr/bin/env node

const { exec } = require("child_process");

exec(
  "npx jscodeshift -t ./transformer.js ./test/index.js --dry --print",
  (err, stdout) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(stdout);
  }
);
