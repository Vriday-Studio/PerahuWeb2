const fse = require('fs-extra');
const path = require('path');

const topDir = __dirname;
const tinymceSource = path.join(topDir, 'node_modules', 'tinymce');
const tinymceDest = path.join(topDir, 'public', 'tinymce');

if (fse.existsSync(tinymceSource)) {
  fse.emptyDirSync(tinymceDest);
  fse.copySync(tinymceSource, tinymceDest, { overwrite: true });
}
