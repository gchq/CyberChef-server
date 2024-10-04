import { exec } from 'node:child_process';

switch (process.platform) {
    case "darwin":
        exec(`find ./node_modules/crypto-api/src/ \\( -type d -name .git -prune \\) -o -type f -print0 | xargs -0 sed -i '' -e '/\\.mjs/!s/\\(from "\\.[^"]*\\)";/\\1.mjs";/g'`);
    default:
        exec(`find ./node_modules/crypto-api/src/ \\( -type d -name .git -prune \\) -o -type f -print0 | xargs -0 sed -i -e '/\\.mjs/!s/\\(from "\\.[^"]*\\)";/\\1.mjs";/g'`);
}

switch (process.platform) {
    case "darwin":
        exec(`sed -i '' 's/<div id=snackbar-container\\/>/<div id=snackbar-container>/g' ./node_modules/snackbarjs/src/snackbar.js`);
    default:
        exec(`sed -i 's/<div id=snackbar-container\\/>/<div id=snackbar-container>/g' ./node_modules/snackbarjs/src/snackbar.js`);
}

switch (process.platform) {
    case "darwin":
        // Space added before comma to prevent multiple modifications
        exec(`sed -i '' 's/"es\\/index.js",/"es\\/index.js" ,\\n  "type": "module",/' ./node_modules/jimp/package.json`);
    default:
        exec(`sed -i 's/"es\\/index.js",/"es\\/index.js" ,\\n  "type": "module",/' ./node_modules/jimp/package.json`);
}