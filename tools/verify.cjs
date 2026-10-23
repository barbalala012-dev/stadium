const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const root = path.resolve(__dirname,'../app/src/main/assets');
const code = fs.readFileSync(path.join(root,'application.js'),'utf8');
new vm.Script(code); // Check the complete bundled React app, including all screens.
new vm.Script(fs.readFileSync(path.join(root,'android.js'),'utf8'));
const store = new Map();
const context = vm.createContext({localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)}});
const dataStart = code.indexOf('WP=[{');
const dataEnd = code.indexOf('const _k=');
assert(dataStart>0 && dataEnd>dataStart);
const routeStart = code.indexOf('function Zj(');
const routeEnd = code.indexOf('function IP(',routeStart);
vm.runInContext('const '+code.slice(dataStart,dataEnd)+code.slice(routeStart,routeEnd),context);
const run = expression => vm.runInContext(expression,context);
assert.equal(run('nc.length'),50);
assert.equal(run('he(Et("food-a"),"during").wait'),18);
assert.equal(run('he(Et("food-b"),"during").wait'),4);
assert.equal(run('he(Et("food-a"),"during",0,{"food-a":2}).source'),'사용자 제보');
for(const mode of ['fast','quiet','accessible']) {
  for(const scenario of ['before','during','change','after']) {
    assert.equal(run(`nc.every(f=>{const r=Zj("f1n5",f.nodeId,"${mode}","${scenario}");return r&&r.distance>=0&&r.minutes>=0})`),true);
  }
}
assert.equal(run('Zj("f1n5","seat212","accessible").stairs'),false);
assert.equal(run('Zj("f1n5","seat212","accessible").elevator'),true);
assert.equal(run('Zj("unknown","seat212")'),null);
assert.equal(run('Ek("food-b","chicken","반반 (+1,000원)")'),true);
assert.equal(run('Ek("food-b","chicken","반반 (+1,000원)")'),true);
assert.equal(run('Ek("food-a","chicken","오리지널")'),false);
assert.equal(run('DP("invalid")'),null);
assert.equal(run('DP("10분 후").total'),38000);
assert.equal(run('jt.get().cart.length'),0);
assert.equal(run('jt.get().orders.length'),1);
assert.equal(run('UP().orders[0].total'),38000);
assert.equal(run('TP("family","19:00").status'),'confirmed');
assert.equal(run('TP("family","19:00")'),null);
assert.equal(run('TP("food-b","19:00")'),null);
run('jt.update({senior:true,family:true})');
assert.equal(run('UP().senior && UP().family'),true);
run('jt.reset()');
assert.equal(run('jt.get().orders.length + jt.get().reservations.length'),0);
const html = fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const m of html.matchAll(/(?:src|href)="([^"#:]+)"/g)) {
  if(m[1].startsWith('data:')) continue;
  assert(fs.existsSync(path.join(root,m[1])),`Missing packaged asset: ${m[1]}`);
}
assert(!code.includes('register("./sw.js")'),'Missing service worker should not be registered');
assert(!code.includes('import.meta'),'Classic script compatibility');
console.log('PASS: bundle syntax, packaged assets, 600 facility routes, accessible elevator routes, crowd reports, menu options, order totals, cart rules, reservations, persistence, settings and reset.');
