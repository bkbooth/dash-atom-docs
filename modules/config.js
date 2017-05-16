const path = require('path');
const basePath = path.join('', 'Atom.docset');

module.exports = {
  dbFile: path.join(basePath, 'Contents', 'Resources', 'docSet.dsidx'),
  docsDir: path.join(basePath, 'Contents', 'Resources', 'Documents'),
  listIndexes: [
    { type: 'Class', fileName: 'class_list.html' },
    { type: 'Method', fileName: 'method_list.html' },
    { type: 'File', fileName: 'file_list.html' },
  ],
  staticFiles: [
    { name: 'Info.plist', dest: path.join(basePath, 'Contents', 'Info.plist') },
    { name: 'icon.png', dest: path.join(basePath, 'icon.png') },
  ],
};
