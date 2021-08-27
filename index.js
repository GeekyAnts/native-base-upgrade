#! /usr/bin/env node

const { exec } = require("child_process");

exec("npx jscodeshift -t ./transformer.js ./test/index.js", (err, stdout) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stdout);
});

// exec(
//   "npx jscodeshift -t ./extend-theme-transformer.js ./test/app.js",
//   (err, stdout) => {
//     if (err) {
//       console.error(err);
//       return;
//     }
//     console.log(stdout);
//   }
// );
