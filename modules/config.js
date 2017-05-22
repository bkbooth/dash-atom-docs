const path = require('path');
const basePath = path.join('.', 'Atom.docset');

module.exports = {
  // Location of the docset database
  dbFile: path.join(basePath, 'Contents', 'Resources', 'docSet.dsidx'),

  // Location of the docset documents
  docsDir: path.join(basePath, 'Contents', 'Resources', 'Documents'),
  // Location of the scraped documents
  scrapeDir: path.join('.', 'scraped'),
  // CSS selectors to find and remove from HTML documents
  selectorsToRemove: [
    'head',
    'meta',
    '.top-bar',
    '.documents > .wrapper > form',
    '.column.sidebar',
    '.footer-pad',
    'footer',
  ],
  // Name of Atom stylesheet
  atomCssFilename: 'styles-atom.css',

  // Static files to be copied into docset
  staticFiles: [
    { name: 'styles-dash.css', dest: path.join(basePath, 'Contents', 'Resources', 'Documents', 'assets', 'styles-dash.css') },
    { name: 'Info.plist', dest: path.join(basePath, 'Contents', 'Info.plist') },
    { name: 'icon.png', dest: path.join(basePath, 'icon.png') },
  ],
};
