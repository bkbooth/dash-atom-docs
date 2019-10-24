/**
 * @typedef {import('./config').Config} Config
 */

const fs = require('fs').promises;
const path = require('path');

/**
 * Copy the Atom docs CSS into docset
 *
 * @param {Config} config
 *
 * @returns {Promise}
 */
async function copyDocsCss(config) {
  const scrapedStylesheet = 'application.css';
  console.log(`Copying Atom docs CSS file '${scrapedStylesheet}' to '${config.atomCssFilename}'...`);
  const scrapedStylesheetPath = path.join(
    config.scrapeDir,
    'flight-manual.atom.io',
    'assets',
    'stylesheets',
    scrapedStylesheet
  );
  try {
    await fs.copyFile(scrapedStylesheetPath, path.join(config.docsDir, 'assets', config.atomCssFilename));
  } catch (error) {
    throw new Error(`Failed copying Atom API docs CSS file. ${error.message}`);
  }
}

/**
 * Copy static files in place
 *
 * @param {Config} config
 *
 * @returns {Promise}
 */
async function copyStaticFiles(config) {
  try {
    await Promise.all(
      config.staticFiles.map(({ name, dest }) => {
        console.log(`Copying static file '${name}' into docset...`);
        return fs.copyFile(path.join('assets', name), dest);
      })
    );
  } catch (error) {
    throw new Error(`Failed copying file. ${error.message}`);
  }
}

module.exports = { copyDocsCss, copyStaticFiles };
