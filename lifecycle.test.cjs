// Lightweight DOM stubs check application state transitions without claiming browser rendering QA.
const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const C=require('./core.js');
const packs=[require('./customer-service.json'),require('./claude-fundamentals.json')];
const source=fs.readFileSync(require('node:path').join(__dirname,'./app.js'),'utf8');
function boot({corrupt=false,blocked=false}={}) {
  const events={}, nodes=new Map(), writes=[], queues=[], store=new Map();
  if(corrupt)store.set('endsight-codex-arcade-v1','{broken');
  function node(){return {innerHTML:'',textContent:'',style:{setProperty(){}},classList:{add(){},toggle(){}},focus(){},scrollIntoView(){},querySelector(){return node();},remove(){},append(){},click(){},dataset:{}};}
  const doc={hidden:false,body:node(),activeElement:node(),getElementById(id){if(!nodes.has(id))nodes.set(id,node());return nodes.get(id);},querySelector(s){return node();},querySelectorAll(s){return s==='.relay-slot'?Array.from({length:20},node):s==='[data-answer]'?Array.from({length:(nodes.get('app')?.innerHTML.match(/data-answer=/g)||[]).length},node):[];},createElement(){return node();},addEventListener(k,f){events[k]=f;}};
  const core={...C,questions(...args){args[5]=()=>.314;const q=C.questions(...args);queues.push(q);return q;}};
  let timer=null;
  const context={ArcadeCore:core,document:doc,window:{ARCADE_CONTENT:packs,scrollTo(){}},localStorage:{getItem(k){if(blocked)throw Error('blocked');return store.get(k)||null;},setItem(k,v){if(blocked)throw Error('blocked');writes.push(k);store.set(k,v);},removeItem(k){store.delete(k);}},matchMedia:()=>({matches:true}),performance:{now:()=>0},setInterval:f=>(timer=f,1),clearInterval:()=>{timer=null;},setTimeout,URL,Blob,console};
  vm.runInNewContext(source,context);
  const click=dataset=>events.click({target:{closest:()=>({dataset,disabled:false})}});
  return {doc,click,queues,writes,store,html:()=>doc.getElementById('app').innerHTML,tick:()=>timer?.()};
}
test('all games complete a Learn run, save XP, and return to the arcade',()=>{
  for(const game of ['bridge','cable','tower','relay','boss']) {
    const h=boot();assert.match(h.html(),/Level up your/);h.click({start:game});const queue=h.queues.at(-1);
    for(const q of queue){
      if(h.html().includes('data-action="ready"'))h.click({action:'ready'});
      if(q.steps)for(let i=0;i<q.steps.length;i++)h.click({answer:String(q.options.findIndex(o=>o.index===i))});
      else h.click({answer:String(q.options.findIndex(o=>o.correct))});
      h.click({action:'next'});
    }
    assert.match(h.html(),game==='boss'?/CIRCUIT CLEARED/:/That’s a clean run/);
    const save=JSON.parse(h.store.get('endsight-codex-arcade-v1'));assert(save.xp>0);assert.equal(save.runs.length,1);assert.equal(save.runs[0].correct,queue.length);
    h.click({action:'home'});assert.match(h.html(),/Choose your next challenge/);
  }
});
test('Train ends after three wrong answers and awards no accuracy credit',()=>{
  const h=boot();h.click({mode:'train'});h.click({start:'bridge'});const qs=h.queues.at(-1);
  for(let i=0;i<3;i++){h.click({answer:String(qs[i].options.findIndex(o=>!o.correct))});h.click({action:'next'});}
  assert.match(h.html(),/A little better than before/);const p=JSON.parse(h.store.get('endsight-codex-arcade-v1'));assert.equal(p.runs[0].correct,0);assert.equal(p.runs[0].total,3);
});
test('corrupt and blocked storage never get overwritten by an in-memory run',()=>{
  for(const options of [{corrupt:true},{blocked:true}]){
    const h=boot(options);assert.match(h.html(),/Browser storage is unavailable/);h.click({start:'bridge'});h.click({action:'ready'});const q=h.queues.at(-1)[0];h.click({answer:String(q.options.findIndex(o=>o.correct))});assert.equal(h.writes.length,0);
  }
});
test('Focus skips teaching sheets and remains untimed',()=>{
  const h=boot();h.click({mode:'focus'});h.click({start:'bridge'});assert(!h.html().includes('data-action="ready"'));assert.match(h.html(),/class="timer" hidden/);h.tick();
});
