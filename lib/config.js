/**
 * @typedef {Object} Config
 * @property {string} dbFile Path to the docset database file
 * @property {string} docsDir Path to the docset documents directory
 * @property {string} scrapeDir Path to the scraped API documents
 * @property {string[]} selectorsToRemove CSS selectors to find and remove from HTML documents
 * @property {string} atomCssFilename Name of the Atom API docs stylesheet
 * @property {Object[]} staticFiles Static files to be copied into the docset
 * @property {string} staticFiles.name Name of the static file
 * @property {string} staticFiles.dest Destination path for the static file
 */

const path = require('path');

const DOCSET_BASE_PATH = path.join('.', 'Atom.docset');

/**
 * @type {Config}
 */
module.exports = {
  dbFile: path.join(DOCSET_BASE_PATH, 'Contents', 'Resources', 'docSet.dsidx'),
  docsDir: path.join(DOCSET_BASE_PATH, 'Contents', 'Resources', 'Documents'),
  scrapeDir: path.join('.', 'scraped'),
  selectorsToRemove: [
    'head',
    'meta',
    'script',
    '.top-bar',
    '.documents-search',
    '.autocomplete-results',
    '.toc',
    '.document-title',
    '.footer-pad',
    'footer',
  ],
  atomCssFilename: 'styles-atom.css',
  staticFiles: [
    {
      name: 'styles-dash.css',
      dest: path.join(DOCSET_BASE_PATH, 'Contents', 'Resources', 'Documents', 'assets', 'styles-dash.css'),
    },
    {
      name: 'octicons.eot',
      dest: path.join(DOCSET_BASE_PATH, 'Contents', 'Resources', 'Documents', 'assets', 'octicons.eot'),
    },
    {
      name: 'octicons.woff',
      dest: path.join(DOCSET_BASE_PATH, 'Contents', 'Resources', 'Documents', 'assets', 'octicons.woff'),
    },
    {
      name: 'octicons.ttf',
      dest: path.join(DOCSET_BASE_PATH, 'Contents', 'Resources', 'Documents', 'assets', 'octicons.ttf'),
    },
    {
      name: 'octicons.svg',
      dest: path.join(DOCSET_BASE_PATH, 'Contents', 'Resources', 'Documents', 'assets', 'octicons.svg'),
    },
    { name: 'Info.plist', dest: path.join(DOCSET_BASE_PATH, 'Contents', 'Info.plist') },
    { name: 'icon.png', dest: path.join(DOCSET_BASE_PATH, 'icon.png') },
  ],
};
