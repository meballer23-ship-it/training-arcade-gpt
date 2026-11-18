const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const packs = ['customer-service', 'claude-fundamentals'].map(id => JSON.parse(read(`${id}.json`)));
const safe = s => s.replace(/<\/script/gi, '<\\/script');
const html = read('template.html').replace('/* STYLES */', read('styles.css')).replace('/* CONTENT */', 'window.ARCADE_CONTENT=' + safe(JSON.stringify(packs)) + ';').replace('/* CORE */', safe(read('core.js'))).replace('/* APP */', safe(read('app.js')));
fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, 'dist/index.html'), html);
fs.writeFileSync(path.join(root, 'endsight-arcade.html'), html);

fs.writeFileSync(path.join(root, 'index.html'), html);

console.log(`Built endsight-arcade.html and dist/index.html (${Math.round(Buffer.byteLength(html)/1024)} KB); ${packs.length} courses, ${packs.reduce((n,p)=>n+p.atoms.length,0)} learning items. No external assets.`);
