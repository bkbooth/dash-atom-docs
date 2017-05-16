const fs = require('fs');

const config = require('./modules/config');
const docLists = require('./modules/doc-lists').load(config);

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(config.dbFile, (err) => {
  if (err) {
    console.error(`Error opening database ${config.dbFile}`, err.code);
    process.exit();
  }
  console.info(`Opened database ${config.dbFile}`);
});

db.serialize(() => {
  // Initialize the database
  db.run('DROP TABLE IF EXISTS searchIndex');
  db.run('CREATE TABLE searchIndex(id INTEGER PRIMARY KEY, name TEXT, type TEXT, path TEXT)');
  db.run('CREATE UNIQUE INDEX anchor ON searchIndex(name, type, path)');

  // Create and insert the entries
  docLists.forEach((docList) => {
    const insertStmt = db.prepare('INSERT INTO searchIndex(name, type, path) VALUES ($name, $type, $path)');
    docList.data.forEach((item) => insertStmt.run({
      $name: item.name,
      $type: docList.type,
      $path: item.path,
    }));
    insertStmt.finalize();
  });
});

// Close the database connection
db.close();

// Move extra files into their locations
console.info(`Copying ${config.staticFiles.map((file) => file.name).join(', ')} into docset`);
config.staticFiles.forEach((file) => {
  fs.createReadStream(file.name).pipe(fs.createWriteStream(file.dest));
});
