const fs = require('fs');
const path = require('path');
const argv = require('minimist')(process.argv.slice(2), { alias: { 'atom-version': 'a' } });
const mkdirp = require('mkdirp');
const cheerio = require('cheerio');
const config = require('./config');

config.atomVersion = argv['atom-version'] || process.env.npm_package_atom_version;
if (!config.atomVersion) {
  console.error(
    'Atom version not provided.\n',
    'Provide as --atom-version (or -a) command-line argument or set atom_version in package.json'
  );
  process.exit(1);
}

console.log(`Processing Atom docs v${config.atomVersion}`);

mkdirp.sync(path.join(config.docsDir, 'assets'));
copyDocsCss(config);
copyStaticFiles(config);
transformDocsHtml(config);


// Find, process and copy all docs HTML into docset
function transformDocsHtml(config) {
  const docsFilesDir = path.join(config.scrapeDir, 'atom.io', 'docs', 'api', `v${config.atomVersion}`);
  const docsFilesList = fs.readdirSync(docsFilesDir);

  docsFilesList.forEach((docsFileName) => {
    const fileData = fs.readFileSync(path.join(docsFilesDir, docsFileName));
    const $ = cheerio.load(fileData, {
      normalizeWhitespace: true,
    });

    // Exit if page is 404
    if (/404/.test($('head title').text())) {
      console.log(`Ignoring ${docsFileName}...`);
      return;
    }

    console.log(`Processing ${docsFileName}...`);

    // Remove unwanted elements
    config.selectorsToRemove.forEach((selectorToRemove) => $(selectorToRemove).remove());

    // Add a new header block
    $.root().prepend(`
      <head>
        <meta charset="utf-8">
        <title>${docsFileName.split('.')[0]}</title>
        <link rel="stylesheet" href="assets/${config.atomCssFilename}">
        <link rel="stylesheet" href="assets/${config.staticFiles[0].name}">
      </head>
    `);

    // Write the transformed file
    fs.writeFileSync(path.join(config.docsDir, docsFileName), $.html());
  });
}

// Find and copy the Atom docs CSS into docset
function copyDocsCss(config) {
  const docsCssRegex = /^application-[0-9a-zA-Z]+\.css$/;
  const docsAssetsDir = path.join(config.scrapeDir, 'github-atom-io-herokuapp-com.global.ssl.fastly.net', 'assets');
  const docsAssetsFiles = fs.readdirSync(docsAssetsDir);
  const docsCssFile = docsAssetsFiles.find((docsAssetsFile) => docsCssRegex.test(docsAssetsFile));
  if (!docsCssFile) {
    console.error('Failed finding Atom docss CSS to copy into docset');
    process.exit(1);
  }

  console.log(`Copying Atom docs CSS file '${docsCssFile}' to '${config.atomCssFilename}'...`);

  const readStream = fs.createReadStream(path.join(docsAssetsDir, docsCssFile));
  const writeStream = fs.createWriteStream(path.join(config.docsDir, 'assets', config.atomCssFilename));
  readStream.once('error', handleFailedCssCopy);
  writeStream.once('error', handleFailedCssCopy);
  readStream.pipe(writeStream);

  function handleFailedCssCopy(err) {
    console.error('Failed copying Atom docs CSS file.', err.message);
    process.exit(1);
  }
}

// Copy static files in place
function copyStaticFiles(config) {
  config.staticFiles.forEach((staticFile) => {
    console.log(`Copying static file '${staticFile.name}' into docset...`);

    const readStream = fs.createReadStream(path.join('assets', staticFile.name));
    const writeStream = fs.createWriteStream(staticFile.dest);
    readStream.once('error', handleFailedFileCopy);
    writeStream.once('error', handleFailedFileCopy);
    readStream.pipe(writeStream);
  });

  function handleFailedFileCopy(err) {
    console.error('Failed copying file.', err.message);
    process.exit(1);
  }
}
