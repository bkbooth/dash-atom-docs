const fs = require('fs');
const cheerio = require('cheerio');

module.exports = {
  load(config) {
    return config.listIndexes.reduce((docLists, listIndex) => {
      const data = fs.readFileSync(config.docsDir + listIndex.fileName);
      const $ = cheerio.load(data);
      console.info(`Opened file ${config.docsDir + listIndex.fileName}`);

      const links = $('#content > ul > li > a');
      const docList = {
        type: listIndex.type,
        data: links.reduce((docListData, link) => {
          const path = $(link).attr('href');
          const parent = $(link).next().text().replace(/[\s\(\)<]/g, '');

          let name = $(link).text().trim();
          if (listIndex.type === 'Method' && parent !== 'window.coffee') {
            name = parent + name;
          } else if (parent === 'window.coffee') {
            name = name.substr(1);
          }

          return [...docListData, { name, path }];
        }, []),
      };

      console.info(`Found ${docList.data.length} ${docList.type} entries`);
      return [...docLists, docList];
    }, []);
  }
};
