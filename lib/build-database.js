/**
 * @typedef {import('./config').Config} Config
 *
 * @typedef {('Constructor'|'Event'|'Method'|'Property')} EntryType
 *
 * @typedef {Object} DocsDatabaseEntry
 * @property {string} name Name of the database entry
 * @property {EntryType} type A supported Dash entry type (https://kapeli.com/docsets#supportedentrytypes)
 * @property {string} path Relative path to the documentation file for this entry
 */

const sqlite3 = require('sqlite3');

/**
 *
 * @param {Config} config
 * @param {DocsDatabaseEntry[]} docsEntries
 */
async function buildDatabase(config, docsEntries) {
  const db = new sqlite3.Database(config.dbFile, error => {
    if (error) {
      throw new Error(`Error opening database ${config.dbFile}. ${error.message}`);
    }
    console.log(`Opened database ${config.dbFile}`);

    db.serialize(() => {
      // Initialize the database
      db.run('DROP TABLE IF EXISTS searchIndex');
      db.run('CREATE TABLE searchIndex(id INTEGER PRIMARY KEY, name TEXT, type TEXT, path TEXT)');
      db.run('CREATE UNIQUE INDEX anchor ON searchIndex(name, type, path)');

      console.log(`Adding ${docsEntries.length} entries to the database.`);

      // Create and insert the entries
      const insertStmt = db.prepare('INSERT INTO searchIndex(name, type, path) VALUES ($name, $type, $path)');
      docsEntries.forEach(docEntry =>
        insertStmt.run({
          $name: docEntry.name,
          $type: docEntry.type,
          $path: docEntry.path,
        })
      );
      insertStmt.finalize();
    });

    db.close();
  });
}

module.exports = { buildDatabase };
