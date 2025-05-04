// scan-fa-icons.js
const fs = require('fs');
const path = require('path');

const iconSet = new Set();

function walk(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (/\.(html|liquid|md|js|json|yml|xml)$/.test(file)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const matches = content.match(/fa-(solid|regular|brands)\s+fa-[a-z0-9-]+/g);
      if (matches) {
        matches.forEach(match => iconSet.add(match.trim()));
      }
    }
  });
}

walk('.'); // start from current folder
console.log('✅ Unique Font Awesome Icons Used:\n');
[...iconSet].sort().forEach(icon => console.log(icon));
