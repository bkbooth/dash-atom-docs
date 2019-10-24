const childProcess = require('child_process');

const result = childProcess.spawnSync('httrack', ['--version']);

if (result.error) {
  console.error('httrack not found. You must setup httrack (https://www.httrack.com/) before continuing.');
  process.exit(1);
} else {
  console.log('httrack found.');
}
