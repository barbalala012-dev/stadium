const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname,'..');
const assets = path.join(root,'app/src/main/assets');
let html = fs.readFileSync(path.join(assets,'index.html'),'utf8');
for(const name of ['base.css','mobile.css']) {
  html=html.replace(`<link rel="stylesheet" href="${name}"/>`,()=>`<style>${fs.readFileSync(path.join(assets,name),'utf8')}</style>`);
}
for(const name of ['application.js','android.js']) {
  const script=fs.readFileSync(path.join(assets,name),'utf8').replace(/<\/script/gi,'<\\/script');
  html=html.replace(`<script defer src="${name}"></script>`,'');
  html=html.replace('</body>',()=>`<script>${script}</script></body>`);
}
fs.mkdirSync(path.join(root,'delivery'),{recursive:true});
fs.writeFileSync(path.join(root,'delivery/Spodium-On-Preview.html'),html);
console.log('Created delivery/Spodium-On-Preview.html');
