/**
 * @typedef {import('./config').Config} Config
 */

const fs = require('fs').promises;
const argv = require('minimist')(process.argv.slice(2), { alias: { 'atom-version': 'a' } });
const path = require('path');
const config = require('./config');
const { copyDocsCss, copyStaticFiles } = require('./copy-files');
const { transformDocsFiles } = require('./transform-docs-files');
const { buildDatabase } = require('./build-database');

config.atomVersion = argv['atom-version'] || process.env.npm_package_atom_version;
if (!config.atomVersion) {
  console.error(
    'Atom version not provided.\n',
    'Provide as --atom-version (or -a) command-line argument or set atom_version in package.json'
  );
  process.exit(1);
}

console.log(`Processing Atom docs v${config.atomVersion}`);

(async () => {
  try {
    await fs.mkdir(path.join(config.docsDir, 'assets'), { recursive: true });
    await copyDocsCss(config);
    await copyStaticFiles(config);

    const docsEntries = await transformDocsFiles(config);
    await buildDatabase(config, docsEntries);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
})();
