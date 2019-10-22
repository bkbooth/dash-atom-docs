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
    'script',
    '.top-bar',
    '.documents-search',
    '.autocomplete-results',
    '.toc',
    '.document-title',
    '.footer-pad',
    'footer',
  ],
  // Name of Atom stylesheet
  atomCssFilename: 'styles-atom.css',

  // Static files to be copied into docset
  staticFiles: [
    {
      name: 'styles-dash.css',
      dest: path.join(basePath, 'Contents', 'Resources', 'Documents', 'assets', 'styles-dash.css'),
    },
    {
      name: 'octicons.eot',
      dest: path.join(basePath, 'Contents', 'Resources', 'Documents', 'assets', 'octicons.eot'),
    },
    {
      name: 'octicons.woff',
      dest: path.join(basePath, 'Contents', 'Resources', 'Documents', 'assets', 'octicons.woff'),
    },
    {
      name: 'octicons.ttf',
      dest: path.join(basePath, 'Contents', 'Resources', 'Documents', 'assets', 'octicons.ttf'),
    },
    {
      name: 'octicons.svg',
      dest: path.join(basePath, 'Contents', 'Resources', 'Documents', 'assets', 'octicons.svg'),
    },
    { name: 'Info.plist', dest: path.join(basePath, 'Contents', 'Info.plist') },
    { name: 'icon.png', dest: path.join(basePath, 'icon.png') },
  ],
};
