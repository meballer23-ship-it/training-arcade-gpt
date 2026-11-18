const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const C=require('./core.js');
const packs=['customer-service','claude-fundamentals'].map(p=>require(`./${p}.json`));
function random(seed=9){return ()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};}

test('every course and module produces all four playable games and a mixed boss',()=>{
  for(const pack of packs)for(const m of pack.modules)for(const game of [...Object.keys(C.gameTypes),'boss']) {
    const qs=C.questions(pack,m.id,game,{},Date.now(),random());
    assert(qs.length>0,`${pack.id}/${m.id}/${game} is empty`);
    for(const q of qs){assert(q.prompt);assert(q.options.length>=2);assert(q.options.every(o=>typeof o.text==='string'&&o.text.length));if(q.steps){assert.equal(q.options.filter(o=>o.index>=0).length,q.steps.length);assert.equal(new Set(q.steps).size,q.steps.length);}else assert.equal(q.options.filter(o=>o.correct).length,1);}
    if(game==='boss')assert.equal(new Set(qs.map(q=>q.game)).size,4);
  }
});
test('mastery requires spaced correct answers and drops on a mistake',()=>{
  let a=C.updateAtom(null,true,100000,'v1');assert.equal(a.box,1);
  a=C.updateAtom(a,true,101000,'v1');assert.equal(a.box,1);
  for(let i=1;i<=3;i++)a=C.updateAtom(a,true,101000+i*86400000,'v1');
  assert.equal(a.box,4);assert.equal(a.due-a.lastSeen,14*86400000);
  a=C.updateAtom(a,false,a.lastSeen+1000,'v1');assert.equal(a.box,3);assert.equal(a.due-a.lastSeen,600000);
});
test('changed content resets mastery and isolated course keys prevent collisions',()=>{
  const old=C.updateAtom(null,true,100000,'old');const a=C.updateAtom(old,true,200000,'new');assert.equal(a.box,1);assert.equal(a.seen,1);
  const keys=packs.flatMap(p=>p.atoms.map(a=>`${p.id}:${a.id}`));assert.equal(keys.length,new Set(keys).size);
});
test('due items are scheduled before unseen and future items',()=>{
  const pack=packs[0],m=pack.modules[0],terms=pack.atoms.filter(a=>a.module===m.id&&a.type==='term');
  const p=Object.fromEntries(pack.atoms.map(a=>[a.id,{due:99999}]));p[terms[2].id]={due:100};
  assert.equal(C.questions(pack,m.id,'bridge',p,200,random())[0].atom.id,terms[2].id);
});
test('true/false questions include both authored beliefs and corrective truths',()=>{
  const seen=new Set();for(let seed=1;seed<40;seed++)for(const q of C.questions(packs[0],packs[0].modules[0].id,'bridge',{},0,random(seed)))if(q.atom.type==='misconception')seen.add(q.options.find(o=>o.correct).text);
  assert.deepEqual([...seen].sort(),['False','True']);
});
test('progress loading rejects invalid numeric values and restores valid saves',()=>{
  const doc={version:1,xp:150,atoms:{valid:{box:2,seen:3,correct:2,due:123},bad:{box:900,due:'x'}},bests:{x:300,bad:-1},runs:[{at:1,score:25},null],settings:{mode:'invalid',sound:true}};
  const p=C.normalizeSave(doc);assert.equal(p.xp,150);assert.equal(p.atoms.valid.box,2);assert(!p.atoms.bad);assert.equal(p.settings.mode,'learn');assert.equal(p.runs.length,1);assert(!p.bests.bad);
  assert.equal(C.normalizeSave({version:9,xp:100}).xp,0);
});
test('scores are bounded, errors score zero, and content is HTML escaped',()=>{
  assert.equal(C.score(false,100,100),0);assert.equal(C.score(true,5,0),C.score(true,100,0));assert.equal(C.escape('<img src=x onerror="bad">'), '&lt;img src=x onerror=&quot;bad&quot;&gt;');
});
test('built artifact is self-contained with no external resources or placeholders',()=>{
  const html=fs.readFileSync(path.join(__dirname,'./dist/index.html'),'utf8');assert(html.startsWith('<!doctype html>'));assert(!html.includes('/* APP */'));assert(!/<(?:script|link|img)[^>]+(?:src|href)=["']https?:/i.test(html));assert(html.includes('window.ARCADE_CONTENT='));
});
