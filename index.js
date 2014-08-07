var _ = require('lodash'),
    fs = require('fs'),
    sqlite3 = require('sqlite3'),
    config = require('./modules/config'),
    lists = require('./modules/lists').get(config),
    db = new sqlite3.Database(config.dbfile, function(err) {
        if (err) {
            console.error('Error opening database ' + config.dbfile, err.code);
            process.exit();
        }
        console.info('Opened database ' + config.dbfile);
    });

db.serialize(function() {
    // Initialize the database
    db.run('DROP TABLE IF EXISTS searchIndex');
    db.run('CREATE TABLE searchIndex(id INTEGER PRIMARY KEY, name TEXT, type TEXT, path TEXT)');
    db.run('CREATE UNIQUE INDEX anchor ON searchIndex(name, type, path)');

    // Create and insert the entries
    _.forEach(lists, function(list) {
        var stmt = db.prepare('INSERT INTO searchIndex(name, type, path) VALUES ($name, $type, $path)');
        _.forEach(list.data, function(item) {
            stmt.run({
                $name: item.name,
                $type: list.type,
                $path: item.path
            });
        });
        stmt.finalize();
    });
});

// Close the database connection
db.close();

// Move extra files into their locations
console.info('Copying ' + _.map(config.files, 'name').join(', ') + ' into docset');
_.forEach(config.files, function(file) {
    fs.createReadStream(file.name).pipe(fs.createWriteStream(file.dest));
});
