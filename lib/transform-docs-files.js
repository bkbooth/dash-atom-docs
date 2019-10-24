/**
 * @typedef {import('./config').Config} Config
 * @typedef {import('./build-database').DocsDatabaseEntry} DocsDatabaseEntry
 * @typedef {import('./build-database').EntryType} EntryType
 */

const cheerio = require('cheerio');
const fs = require('fs').promises;
const path = require('path');
const prettier = require('prettier');
const { asyncFilter } = require('./utils');

/**
 * Find, process and copy all docs HTML into docset
 * Build a list of docs items for the database
 *
 * @param {Config} config
 *
 * @returns {Promise<DocsDatabaseEntry[]>}
 */
async function transformDocsFiles(config) {
  const docsFilesDir = path.join(config.scrapeDir, 'flight-manual.atom.io', 'api', `v${config.atomVersion}`);
  const docsFilesList = await fs.readdir(docsFilesDir);
  const docsNames = await asyncFilter(docsFilesList, async fileName =>
    (await fs.lstat(path.join(docsFilesDir, fileName))).isDirectory()
  );
  const prettierConfig = await prettier.resolveConfig(process.cwd());
  const listsOfDocsEntries = await Promise.all(
    docsNames.map(async docName => {
      console.log(`Processing ${docName}...`);
      const fileData = await fs.readFile(path.join(docsFilesDir, docName, 'index.html'));
      const $ = cheerio.load(fileData);

      // Remove unwanted elements
      config.selectorsToRemove.forEach(selectorToRemove => $(selectorToRemove).remove());

      // Add a new header block
      $.root().prepend(`
        <head>
          <meta charset="utf-8">
          <title>${docName}</title>
          <link rel="stylesheet" href="../assets/${config.atomCssFilename}">
          <link rel="stylesheet" href="../assets/${config.staticFiles[0].name}">
        </head>
      `);

      // Get database entries from the doc file
      const docsEntries = getDocsEntries($, docName);

      // Write the transformed file
      const docDirPath = path.join(config.docsDir, docName);
      await fs.mkdir(docDirPath, { recursive: true });
      const html = prettier.format($.html(), { ...prettierConfig, parser: 'html' });
      await fs.writeFile(path.join(docDirPath, 'index.html'), html);

      return docsEntries;
    })
  );

  // Return a flattened array of the docs entries
  return [].concat(...listsOfDocsEntries);
}

/**
 * Search through HTML docs for classes, methods, events and properties
 *
 * @param {CheerioStatic} $
 * @param {string} docName
 *
 * @returns {DocsDatabaseEntry[]}
 */
function getDocsEntries($, docName) {
  const entryNameRegex = /^(\.|:{2})([a-zA-Z0-9]+)\(?/;
  const entries = $('.api-entry > h3 > a:first-child')
    .map((_index, element) => {
      const [, , entryName] = $(element)
        .text()
        .trim()
        .match(entryNameRegex);
      const entryType = getEntryType($, element, entryName);
      const entryPath = $(element).attr('href');

      // Add table of contents anchor
      $(
        `<a name="//apple_ref/cpp/${entryType}/${
          entryName === 'constructor' ? docName : entryName
        }" class="dashAnchor"></a>`
      ).insertBefore(element);

      return {
        name: entryName === 'constructor' ? docName : `${docName}.${entryName}`,
        type: entryType,
        path: path.join(docName, 'index.html') + entryPath,
      };
    })
    .toArray();
  console.log(`Found ${entries.length + 1} ${docName} entries.`);
  return [
    {
      name: docName,
      type: 'Class',
      path: path.join(docName, 'index.html'),
    },
    ...entries,
  ];
}

/**
 * Determine the Dash documentation entry type
 *
 * @param {CheerioStatic} $
 * @param {CheerioElement} element
 * @param {string} entryName
 *
 * @returns {EntryType}
 */
function getEntryType($, element, entryName) {
  if ($(element).hasClass('method-signature')) {
    if (entryName === 'constructor') {
      return 'Constructor';
    } else if (/^on[A-Z]/.test(entryName)) {
      return 'Event';
    } else {
      return 'Method';
    }
  } else {
    return 'Property';
  }
}

module.exports = { transformDocsFiles };
