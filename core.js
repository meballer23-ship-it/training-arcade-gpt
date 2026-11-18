(function(root) {
  'use strict';
  const shuffle = (arr, random = Math.random) => {
    const out = arr.slice();
    for(let i=out.length-1;i>0;i--) { const j=Math.floor(random()*(i+1)); [out[i],out[j]]=[out[j],out[i]]; }
    return out;
  };
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const gameTypes = {bridge:['term','misconception'], cable:['category','term'], tower:['scenario'], relay:['sequence']};
  function questions(pack, moduleId, game, progress = {}, now = Date.now(), random = Math.random) {
    let atoms = pack.atoms.filter(a => a.module === moduleId && (game==='boss' ? Object.values(gameTypes).flat().includes(a.type) : gameTypes[game].includes(a.type)));
    atoms = shuffle(atoms, random).sort((a,b)=> {
      const priority = x => !progress[x.id] ? 2 : progress[x.id].due <= now ? 3 : 0;
      return priority(b)-priority(a);
    });
    const out=[];
    for (const a of atoms) {
      const base={atom:a, why:a.teach?.why || a.truth || '', teach:a.teach?.card || '', game:game==='boss' ? (a.type==='category'?'cable':a.type==='sequence'?'relay':a.type==='scenario'?'tower':'bridge') : game};
      if(a.type==='term') out.push({...base, prompt:a.prompt, options:shuffle([{text:a.answer,correct:true},...a.distractors.slice(0,2).map(d=>({text:d.text,correct:false}))],random)});
      if(a.type==='misconception') {
        // Alternate the authored myth and its corrective truth, so "False" is not a universal shortcut.
        const truth = random()>.5;
        out.push({...base,prompt:truth?a.truth:a.belief, options:[{text:'True',correct:truth},{text:'False',correct:!truth}]});
      }
      if(a.type==='category') for(const item of shuffle(a.items,random).slice(0,3)) out.push({...base,prompt:item.text, options:shuffle(a.buckets.map(text=>({text,correct:text===item.bucket})),random)});
      if(a.type==='sequence') out.push({...base,prompt:a.prompt,steps:a.steps.slice(),options:shuffle([...a.steps.map((text,index)=>({text,index})),...(a.decoys||[]).slice(0,1).map(text=>({text,index:-1}))],random)});
      if(a.type==='scenario') for(const beat of a.beats) out.push({...base,prompt:beat.prompt,setup:a.setup,persona:a.persona.name,options:shuffle(beat.choices.map(c=>({...c,correct:c.quality==='good'})),random)});
    }
    // Interleave boss presenters instead of truncating to one scenario's beats.
    if(game==='boss') {
      const groups = Object.keys(gameTypes).map(g=>out.filter(q=>q.game===g));
      const mixed=[];
      while(groups.some(g=>g.length)) for(const group of groups) if(group.length) mixed.push(group.shift());
      return mixed.slice(0,8);
    }
    return out.slice(0,game==='relay'?3:6);
  }
  function updateAtom(old, correct, now, hash) {
    const a = old && old.hash===hash ? old : {box:0,seen:0,correct:0};
    // At most one mastery promotion each day; repeated same-session guesses cannot master an item.
    const canPromote = !a.lastCorrect || now-a.lastCorrect >= 20*3600000;
    const box = correct ? Math.min(4,a.box+(canPromote?1:0)) : Math.max(0,a.box-1);
    const days = [0,1,3,7,14][box];
    return {box,seen:a.seen+1,correct:a.correct+(correct?1:0),hash,lastSeen:now,lastCorrect:correct?now:a.lastCorrect||0,due:now+(correct?days*86400000:10*60000)};
  }
  function score(correct, combo, remaining=0) { return correct ? 100+Math.min(combo,5)*20+Math.max(0,Math.round(remaining))*2 : 0; }
  function normalizeSave(doc) {
    const p={atoms:{},bests:{},runs:[],xp:0,settings:{mode:'learn',sound:false,motion:false}};
    if(!doc || doc.version!==1) return p;
    if(doc.atoms && typeof doc.atoms==='object' && !Array.isArray(doc.atoms)) for(const [key,a] of Object.entries(doc.atoms)) {
      if(a && Number.isInteger(a.box) && a.box>=0 && a.box<=4 && Number.isFinite(a.due) && Number.isFinite(a.seen) && Number.isFinite(a.correct)) p.atoms[key]=a;
    }
    if(doc.bests && typeof doc.bests==='object') for(const [k,v] of Object.entries(doc.bests)) if(Number.isFinite(v)&&v>=0) p.bests[k]=v;
    p.runs=Array.isArray(doc.runs)?doc.runs.filter(r=>r&&Number.isFinite(r.score)&&Number.isFinite(r.at)).slice(-30):[];
    p.xp=Number.isFinite(doc.xp)&&doc.xp>=0?doc.xp:0;
    if(doc.settings) p.settings={mode:['learn','train','focus'].includes(doc.settings.mode)?doc.settings.mode:'learn',sound:doc.settings.sound===true,motion:doc.settings.motion===true};
    return p;
  }
  const api={shuffle,escape,gameTypes,questions,updateAtom,score,normalizeSave};
  if(typeof module!=='undefined'&&module.exports) module.exports=api; else root.ArcadeCore=api;
})(globalThis);
