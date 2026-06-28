const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (!filePath.includes('node_modules') && !filePath.includes('.next')) {
        getFiles(filePath, files);
      }
    } else if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
      files.push(filePath);
    }
  }
  return files;
}

const files = getFiles('.');
let changed = 0;
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('Instrument_Serif') && !content.includes('adjustFontFallback')) {
    content = content.replace(/display:\s*['"]swap['"],?/g, "display: 'swap',\n  adjustFontFallback: false,");
    fs.writeFileSync(file, content);
    changed++;
  }
}
console.log('Updated ' + changed + ' files.');
