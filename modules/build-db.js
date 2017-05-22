const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const config = require('./config');

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(config.dbFile, (err) => {
  if (err) {
    console.error(`Error opening database ${config.dbFile}`, err.message);
    process.exit(1);
  }
  console.log(`Opened database ${config.dbFile}`);
});

const docItems = loadDocItems(config);

db.serialize(() => {
  // Initialize the database
  db.run('DROP TABLE IF EXISTS searchIndex');
  db.run('CREATE TABLE searchIndex(id INTEGER PRIMARY KEY, name TEXT, type TEXT, path TEXT)');
  db.run('CREATE UNIQUE INDEX anchor ON searchIndex(name, type, path)');

  console.log(`Adding ${docItems.length} entries to the database.`);

  // Create and insert the entries
  const insertStmt = db.prepare('INSERT INTO searchIndex(name, type, path) VALUES ($name, $type, $path)');
  docItems.forEach((docItem) => insertStmt.run({
    $name: docItem.name,
    $type: docItem.type,
    $path: docItem.path,
  }));
  insertStmt.finalize();
});

// Close the database connection
db.close();


// Search through HTML docs for classes, methods, events and properties
function loadDocItems(config) {
  return fs.readdirSync(config.docsDir)
    .filter(isDocFile)
    .reduce((docItems, docFileName) => {
      const className = docFileName.split('.')[0];
      console.log(`Processing class ${className}...`);
      const fileData = fs.readFileSync(path.join(config.docsDir, docFileName));
      const $ = cheerio.load(fileData);
      const items = $('.api-entry > h3 > a:first-child')
        .map((idx, item) => {
          const itemNameRegex = /^(\.|:{2})([a-zA-Z0-9]+)\(?/;
          const [,,itemName] = $(item).text().trim().match(itemNameRegex);
          const itemType = getItemType($, item, itemName);
          const itemPath = $(item).attr('href');

          return {
            name: itemName === 'constructor' ? className : `${className}.${itemName}`,
            type: itemType,
            path: docFileName + itemPath,
          };
        })
        .toArray();

      console.log(`Found ${items.length + 1} items.`);
      return [...docItems, ...items, {
        name: className,
        type: 'Class',
        path: docFileName,
      }];
    }, []);

  function getItemType($, item, itemName) {
    if ($(item).hasClass('method-signature')) {
      if (itemName === 'constructor') {
        return 'Constructor';
      } else if (/^on[A-Z]/.test(itemName)) {
        return 'Event';
      } else {
        return 'Method';
      }
    } else {
      return 'Property';
    }
  }

  function isDocFile(fileName) {
    return /^[A-Z][a-zA-Z0-9]*\.html$/.test(fileName);
  }
}
