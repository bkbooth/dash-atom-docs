var fs = require('fs'),
    _ = require('lodash'),
    cheerio = require('cheerio');

module.exports = {
    get: function(config) {
        var lists = [];
        _.forEach(config.indices, function(index) {
            var data = fs.readFileSync(config.docsdir + index.file),
                $ = cheerio.load(data),
                list = { type: index.type, data: [] };

            console.info('Opened file ' + config.docsdir + index.file);

            var links = $('#content > ul > li > a');
            _.forEach(links, function(link) {
                var name = $(link).text().trim(),
                    path = $(link).attr('href'),
                    parent = $(link).next().text().replace(/[\s\(\)<]/g, '');

                if (list.type === 'Method' && parent !== 'window.coffee') {
                    name = parent + name;
                } else if (parent === 'window.coffee') {
                    name = name.substr(1);
                }

                list.data.push({ name: name, path: path });
            });

            console.info('Found ' + list.data.length + ' ' + list.type + ' entries');
            lists.push(list);
        });

        return lists;
    }
};
