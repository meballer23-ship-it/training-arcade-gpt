(() => {
  'use strict';
  const C=ArcadeCore, E=C.escape, packs=window.ARCADE_CONTENT, app=document.getElementById('app');
  const KEY='endsight-codex-arcade-v1';
  let storageOK=true, save;
  try { save=C.normalizeSave(JSON.parse(localStorage.getItem(KEY))); } catch {save=C.normalizeSave(null);storageOK=false;}
  if(storageOK)try{localStorage.setItem(KEY+':probe','1');localStorage.removeItem(KEY+':probe');}catch{storageOK=false;}
  let course=0, moduleId=packs[0].modules[0].id, page='arcade', run=null, tick=null, audio=null, modalReturn=null;
  const meta={bridge:{name:'Signal Bridge',tag:'RECALL & REACT',desc:'Pick your lane. Cross the bridge with the right answer.',color:'#86cfe8',time:'6 questions'},cable:{name:'Cable Wyrm',tag:'CONNECT & COLLECT',desc:'Steer your cable. Collect the packet that fits.',color:'#9ee0a5',time:'6 questions'},tower:{name:'Rack Tower',tag:'LISTEN & BUILD',desc:'Handle the call. Stack a stronger connection.',color:'#b9a2ff',time:'6 decisions'},relay:{name:'Runbook Relay',tag:'ORDER & EXECUTE',desc:'Find the flow. Put the right steps in the right order.',color:'#f0bd80',time:'3 runbooks'},boss:{name:'Boss Circuit',tag:'THE FINAL CHECK',desc:'Eight mixed challenges. Aim for 80% accuracy.',color:'#f0bd80',time:'8 challenges'}};
  const paths={play:'m8 5 11 7-11 7V5Z',grid:'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',chart:'M4 20V10m8 10V4m8 16v-7',gear:'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM9 3h6l1 3 3 1 2 5-2 5-3 1-1 3H9l-1-3-3-1-2-5 2-5 3-1Z',bolt:'m13 2-9 12h7l-1 8 10-13h-7l1-7Z',star:'m12 2 3 6 7 1-5 5 1 8-6-4-6 4 1-8-5-5 7-1 3-6Z',shield:'m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6l9-4Zm-4 10 3 3 5-6',book:'M3 4h7l2 2 2-2h7v16h-7l-2 2-2-2H3V4Zm9 2v16'};
  const icon=(name)=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[name]||paths.play}"/></svg>`;
  function art(game,hero=false) {
    let inner='';
    if(game==='bridge') {
      inner='<defs><linearGradient id="sky'+(hero?'h':'c')+'" x2="0" y2="1"><stop stop-color="#292945"/><stop offset="1" stop-color="#14243c"/></linearGradient></defs>';
      inner+=`<rect width="500" height="260" fill="url(#sky${hero?'h':'c'})"/><circle cx="370" cy="57" r="31" fill="#d5e9b6" opacity=".9"/>`;
      for(let i=0;i<14;i++) {const h=30+(i*23%65);inner+=`<rect x="${i*40-10}" y="${145-h}" width="25" height="${h}" fill="#0b1628"/><path d="M${i*40} ${155-h}v${h-18}" stroke="#95a9ca" stroke-width="3" stroke-dasharray="3 7" opacity=".35"/>`;}
      inner+='<path d="m175 135-130 125h410L325 135Z" fill="#141e32"/><path d="M175 135 45 260M325 135l130 125" stroke="#8accc5" stroke-width="4"/><path d="M225 135 180 260M275 135l45 125" stroke="#758be0" stroke-width="2" stroke-dasharray="12 10"/>';
      for(const [x,c] of [[123,'#86d5e6'],[233,'#b6a1ff'],[343,'#d1f56c']]) inner+=`<path d="M${x} 223v-53q18-34 36 0v53" fill="${c}15" stroke="${c}" stroke-width="3"/><path d="M${x+11} 181h14" stroke="${c}" stroke-width="3"/>`;
      inner+='<path d="m246 225 13-8 13 8-13 9Z" fill="#d1f56c"/><circle cx="259" cy="203" r="7" fill="#eaf5cd"/><path d="m259 210-3 12m3-9 9 5" stroke="#b6a1ff" stroke-width="5" stroke-linecap="round"/>';
    } else if(game==='cable') {
      inner='<rect width="500" height="260" fill="#122b2d"/>';
      for(let x=20;x<500;x+=25) for(let y=15;y<260;y+=25) inner+=`<circle cx="${x}" cy="${y}" r="1" fill="#476e64"/>`;
      inner+='<path d="M120 220v-70h100V80h115v80h55" fill="none" stroke="#244e45" stroke-width="31" stroke-linejoin="round"/><path d="M120 220v-70h100V80h115v80h55" fill="none" stroke="#a3d99b" stroke-width="20" stroke-linejoin="round" stroke-dasharray="20 5"/><rect x="374" y="145" width="30" height="30" rx="7" fill="#d1f56c"/><circle cx="396" cy="153" r="3" fill="#122b2d"/>';
      for(const [x,y,l] of [[110,70,'A'],[280,200,'B'],[410,70,'C']])inner+=`<rect x="${x-16}" y="${y-16}" width="32" height="32" rx="7" fill="#b7a0f7"/><text x="${x}" y="${y+5}" text-anchor="middle" font-family="system-ui" font-size="15" fill="#162234">${l}</text>`;
    } else if(game==='tower') {
      inner='<rect width="500" height="260" fill="#26213e"/><path d="M60 230h380" stroke="#53456c"/>';
      for(let i=0;i<5;i++){const x=170+i*6,y=205-i*33;inner+=`<rect x="${x}" y="${y}" width="${170-i*12}" height="26" rx="4" fill="${['#6e6cad','#8683c8','#9992dc','#b0a2ec','#cebbff'][i]}"/><path d="M${x+12} ${y+9}h35m-35 8h23" stroke="#302d56" stroke-width="3"/><circle cx="${x+140-i*12}" cy="${y+12}" r="3" fill="#d1f56c"/>`;}
      inner+='<rect x="269" y="12" width="100" height="26" rx="4" fill="#d1f56c" transform="rotate(-8 319 25)"/><path d="M320 47v22" stroke="#b6a1ff" stroke-dasharray="4 4"/>';
    } else {
      inner='<rect width="500" height="260" fill="#30251f"/><path d="M80 130h340" stroke="#7b6049" stroke-width="2" stroke-dasharray="7 7"/>';
      for(let i=0;i<3;i++) {const x=80+i*127,y=60+(i%2)*25;inner+=`<g transform="translate(${x} ${y}) rotate(${i===1?5:-5} 42 65)"><rect width="95" height="135" rx="8" fill="${i===1?'#f0c68b':'#d5ad7f'}"/><rect x="15" y="17" width="26" height="26" rx="6" fill="#30251f"/><path d="m22 30 5 5 9-12" fill="none" stroke="#f0c68b" stroke-width="3"/><path d="M15 64h65M15 80h55M15 96h42" stroke="#796044" stroke-width="5" stroke-linecap="round"/></g>`;}
    }
    return `<svg viewBox="0 0 500 260" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${inner}</svg>`;
  }
  const persist=()=>{if(!storageOK)return;try{localStorage.setItem(KEY,JSON.stringify({...save,version:1}));}catch{storageOK=false;}};
  const pack=()=>packs[course];
  const atomKey=a=>`${pack().id}:${a.id}`;
  const module=()=>pack().modules.find(m=>m.id===moduleId);
  const courseProgress=()=>Object.fromEntries(pack().atoms.map(a=>[a.id,save.atoms[atomKey(a)]]).filter(([,v])=>v));
  function stats(){const atoms=packs.flatMap(p=>p.atoms.filter(a=>a.type!=='flawed_example').map(a=>save.atoms[`${p.id}:${a.id}`]));return {learned:atoms.filter(a=>a?.box>=1).length,solid:atoms.filter(a=>a?.box>=3).length,due:atoms.filter(a=>a&&a.due<=Date.now()).length};}
  function shell(content){
    const st=stats();
    app.innerHTML=`<div class="shell"><aside class="sidebar"><div class="brand">${icon('bolt')}<div>endsight<small>THE LEARNING ARCADE</small></div></div><nav class="nav" aria-label="Main navigation"><button data-page="arcade" class="${page==='arcade'?'active':''}" aria-label="Arcade">${icon('grid')} Arcade</button><button data-page="progress" class="${page==='progress'?'active':''}" aria-label="Your progress">${icon('chart')} Your progress</button><button data-action="settings" aria-label="Settings">${icon('gear')} Settings</button></nav><div class="sidebar-foot"><div class="local-badge">${icon('shield')} Your own pace.</div>Progress stays in this browser.<br>No account needed.</div></aside><main class="main"><div class="topbar"><div class="crumb">Your learning space &nbsp; / &nbsp; <b>${page==='arcade'?'Arcade':'Your progress'}</b></div><div class="player"><div><strong>Keep your curiosity.</strong>${save.xp.toLocaleString()} lifetime XP</div><div class="avatar" aria-hidden="true">YOU</div></div></div>${!storageOK?'<div class="notice" role="status">Browser storage is unavailable. Progress lasts for this visit; export it in Settings to keep a copy.</div>':''}${content}<footer class="footer"><span>A little practice. A lot of progress.</span><span>Endsight Arcade / Codex edition</span></footer></main></div>`;
    applyMotion();
  }
  function dashboard(){
    const st=stats(), mode=save.settings.mode;
    shell(`<section class="hero"><div class="hero-copy"><div class="eyebrow">LESS STUDYING. MORE DOING.</div><h1>Level up your<br><em>everyday skills.</em></h1><p>Real skills. Short games. Make your next five minutes count.</p><button class="btn primary" data-action="recommended">${st.due?'Review what’s due':'Start a quick run'}</button></div><div class="hero-art">${art('bridge',true)}</div><span class="hero-tag">GOOD HABITS ARE BUILT, ONE RUN AT A TIME.</span></section><div class="stats"><div class="stat">${icon('bolt')}<div><b>${save.xp.toLocaleString()}</b><span>XP earned</span></div></div><div class="stat">${icon('book')}<div><b>${st.learned}</b><span>Skills practiced</span></div></div><div class="stat">${icon('star')}<div><b>${st.due}</b><span>Ready for review</span></div></div></div><div class="section-head"><div><h2>Choose your next challenge</h2><p>Same skills. Four ways to make them stick.</p></div><div class="mode-switch" aria-label="Practice mode">${['learn','train','focus'].map(m=>`<button data-mode="${m}" class="${mode===m?'active':''}" aria-pressed="${mode===m}">${m[0].toUpperCase()+m.slice(1)}</button>`).join('')}</div></div><div class="course-row" aria-label="Courses">${packs.map((p,i)=>`<button class="tab ${i===course?'active':''}" data-course="${i}" aria-pressed="${i===course}">${i===0?'Customer Service':'Claude Fundamentals'}</button>`).join('')}</div><div class="module-row"><label for="module">Practice area</label><select id="module">${pack().modules.map(m=>`<option value="${E(m.id)}" ${m.id===moduleId?'selected':''}>${E(m.title)}</option>`).join('')}</select></div><p class="intro-note">${mode==='learn'?'Learn: read a short tip first, then practice without a timer.':mode==='train'?'Train: timed rounds, three lives, and combo bonuses.':'Focus: no timer, no lives. Take the time you need.'}</p><div class="game-grid">${Object.entries(meta).filter(([g])=>g!=='boss').map(([g,m])=>{
      const available=C.questions(pack(),moduleId,g).length>0, best=save.bests[`${pack().id}:${moduleId}:${g}:${mode}`]||0;
      return `<article class="game-card"><div class="card-art">${art(g)}<span class="game-label">${m.tag}</span></div><div class="card-body"><div class="card-title"><h3>${m.name}</h3><span>${m.time}</span></div><p>${m.desc}</p><div class="card-footer"><span>${best?'Best: '+best.toLocaleString()+' XP':available?'A fresh challenge awaits':'No matching content in this area'}</span><button class="btn small" data-start="${g}" ${available?'':'disabled'}>Play ${icon('play')}</button></div></div></article>`;
    }).join('')}</div><section class="boss-banner">${icon('shield')}<div><div class="eyebrow" style="color:#f0c68b">PUT IT ALL TOGETHER</div><h3 style="margin-top:5px">The Boss Circuit</h3><p>Mix all four challenges. Hit 80% to clear the circuit.</p></div><button class="btn" data-start="boss">Enter circuit</button></section>`);
  }
  function progressPage(){
    const st=stats();
    shell(`<div class="section-head"><div><div class="eyebrow">EVERY RUN ADDS UP</div><h1 style="font-size:2.8rem;margin-top:12px">Look how far you’ve come.</h1><p>${st.solid} skills are solid. Mastery grows with practice across different days.</p></div></div><div class="progress-list">${packs.map(p=>{
      const atoms=p.atoms.filter(a=>a.type!=='flawed_example'), practiced=atoms.filter(a=>save.atoms[`${p.id}:${a.id}`]?.box>0).length, mastered=atoms.filter(a=>save.atoms[`${p.id}:${a.id}`]?.box===4).length;
      return `<article class="progress-card"><h3>${E(p.title)}</h3><p>${practiced} / ${atoms.length} skills practiced · ${mastered} mastered</p><div class="run-progress" role="progressbar" aria-label="${E(p.title)} practiced" aria-valuenow="${practiced}" aria-valuemin="0" aria-valuemax="${atoms.length}"><i style="width:${100*practiced/atoms.length}%"></i></div></article>`;
    }).join('')}</div><div class="section-head"><h2>Recent runs</h2><span class="pill">Saved on this device</span></div>${save.runs.length?save.runs.slice().reverse().map(r=>`<div class="history-row"><div><h3>${E(meta[r.game]?.name||'Practice')}</h3><p>${E(r.course)} · ${E(r.mode)} · ${new Date(r.at).toLocaleDateString()}</p><p>${r.correct}/${r.total} correct</p></div><b>${r.score.toLocaleString()} XP</b></div>`).join(''):'<div class="empty">Your first run starts your story. Pick a game in the Arcade.</div>'}`);
  }
  function render(){page==='progress'?progressPage():dashboard();}
  function applyMotion(){document.body.classList.toggle('calm',save.settings.motion);}
  const reduced=()=>save.settings.motion||matchMedia('(prefers-reduced-motion: reduce)').matches;
  function tone(good){
    if(!save.settings.sound)return;
    try{audio ||= new (window.AudioContext||window.webkitAudioContext)();audio.resume();const o=audio.createOscillator(),g=audio.createGain();o.connect(g);g.connect(audio.destination);o.frequency.setValueAtTime(good?620:180,audio.currentTime);o.frequency.exponentialRampToValueAtTime(good?930:110,audio.currentTime+.15);g.gain.setValueAtTime(.06,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.2);o.start();o.stop(audio.currentTime+.2);}catch{}
  }
  function announce(s){document.getElementById('announcer').textContent=s;}
  function stopTick(){clearInterval(tick);tick=null;}
  function start(game){
    stopTick();const queue=C.questions(pack(),moduleId,game,courseProgress());if(!queue.length)return;
    run={game,mode:save.settings.mode,queue,index:0,score:0,lives:3,combo:0,correct:0,answered:0,missed:[],stage:'',paused:false,tower:0,remaining:0,selected:0,step:0,learned:new Set()};
    next();
  }
  const current=()=>run.queue[run.index];
  function next(){
    stopTick();
    if(run.index>=run.queue.length || (run.mode==='train'&&run.lives<=0))return finish();
    const q=current();run.selected=0;run.step=0;run.used=[];
    const base=q.game==='relay'?Math.max(30,q.steps.length*9):q.game==='cable'?45:q.game==='tower'?45:28;
    const familiarity=save.atoms[atomKey(q.atom)]?.box||0;
    const pace=run.combo>=3&&familiarity>=2?.85:run.answered>0&&run.correct/run.answered<.6?1.2:1;
    run.remaining=run.mode==='train'?Math.round(base*pace):0;run.clock=run.remaining;run.started=performance.now();run.teach=run.mode==='learn'&&!run.learned.has(q.atom.id);run.stage=run.teach?'teach':'question';run.locking=false;run.snake=null;run.dropX=0;run.moving=false;
    if(run.teach)run.learned.add(q.atom.id);
    drawRun();
  }
  function gameShell(body){
    const q=current();
    app.innerHTML=`<main class="game-page"><header class="game-top"><div><div class="eyebrow">${E(module().title)} / ${E(run.mode)}</div><h1>${meta[q.game].name}${run.game==='boss'?' · Boss Circuit':''}</h1></div><div class="hud"><div><span>Score</span><b id="hud-score">${run.score.toLocaleString()}</b></div><div><span>Combo</span><b id="hud-combo">×${run.combo}</b></div><div><span>${run.mode==='train'?'Lives':'Progress'}</span><b id="hud-lives">${run.mode==='train'?'♥'.repeat(run.lives)+'♡'.repeat(3-run.lives):`${run.index+1} / ${run.queue.length}`}</b></div></div><button class="btn quiet small" data-action="pause">Pause</button></header><div class="run-progress"><i style="width:${run.index/run.queue.length*100}%"></i></div>${body}</main>`;
    applyMotion();
  }
  function answerButtons(q,classes=''){
    return `<div class="answers ${q.options.length===2?'two ':''}${classes}">${q.options.map((o,i)=>`<button class="answer" data-answer="${i}" ${run.used.includes(i)?'disabled':''}><b>${i+1}</b><span>${E(o.text)}</span></button>`).join('')}</div>`;
  }
  function drawRun(){
    stopTick();const q=current();
    if(run.stage==='teach') {gameShell(`<section class="teach"><div class="eyebrow">A LITTLE KNOW-HOW BEFORE YOU GO</div><h2>${E(q.atom.prompt||q.persona&&'A better conversation'||'Build the habit')}</h2><p>${E(q.teach)}</p><button class="btn primary" data-action="ready">Got it. Let’s practice.</button></section>`);return;}
    let stage='';
    if(q.game==='bridge')stage=`<div class="stage bridge-stage">${art('bridge')}<div class="lane-markers" aria-hidden="true">${q.options.map((_,i)=>`<span>${i+1}</span>`).join('')}</div><div class="rider" style="--lane:0" aria-hidden="true"></div></div>${answerButtons(q)}<p class="hint">Tap an answer to cross · 1–${q.options.length} to choose · Left / Right then Enter</p>`;
    if(q.game==='cable')stage=reduced()?`${answerButtons(q,'cable-answers')}<p class="hint">Calm controls: choose a packet directly.</p>`:`<div class="stage cable-stage"><div class="cable-grid" role="img" aria-label="Cable field. Use the direction buttons or arrow keys to steer into a numbered packet."></div></div><div class="pad"><button class="btn" data-dir="-1,0" aria-label="Steer left">←</button><button class="btn" data-dir="0,-1" aria-label="Steer up">↑</button><button class="btn" data-dir="0,1" aria-label="Steer down">↓</button><button class="btn" data-dir="1,0" aria-label="Steer right">→</button></div>${answerButtons(q,'cable-answers')}<p class="hint">Steer with arrows or WASD. Collect a packet, or tap its answer below. Cable wraps at edges.</p>`;
    if(q.game==='tower')stage=`<div class="stage tower-stage"><div class="tower-track"><div class="target-zone"></div><div class="moving-block"></div></div>${Array.from({length:Math.min(6,run.tower)},(_,i)=>`<div class="tower-block" style="--width:${155+i*8}px"></div>`).join('')}<div class="tower-block" style="--width:230px;background:#3b4360"></div></div><p class="hint">Choose the best response.${run.mode==='train'&&!reduced()?' Then time your drop for bonus XP.':' A good response builds the rack.'}</p>${answerButtons(q,'tower-answers')}`;
    if(q.game==='relay')stage=`<div class="stage relay-track">${q.steps.map((s,i)=>`<div class="relay-slot ${i<run.step?'filled':''}">${i<run.step?E(s):`Step ${i+1}`}</div>`).join('')}</div>${answerButtons(q,'sequence-answers')}<p class="hint">Choose the next step. Decoys do not belong in the runbook.</p>`;
    gameShell(`<div class="timer" ${run.mode==='train'?'':'hidden'}><i id="clockbar" style="width:100%"></i></div><section class="question"><div class="eyebrow">${run.index+1} OF ${run.queue.length} ${q.game==='relay'?'RUNBOOKS':'CHALLENGES'}${q.game==='relay'?` · STEP ${run.step+1} OF ${q.steps.length}`:''}</div><h2 id="question-title" tabindex="-1">${E(q.prompt)}</h2>${q.game==='tower'?`<p class="muted">${E(q.setup)}</p>`:''}</section><div id="gamebody">${stage}</div><div id="feedback" aria-live="polite"></div>`);
    document.getElementById('question-title').focus({preventScroll:true});
    if(q.game==='bridge')selectLane(0);
    if(q.game==='cable'&&!reduced())initCable();
    resumeTick();
  }
  function selectLane(i){run.selected=Math.max(0,Math.min(current().options.length-1,i));const rider=document.querySelector('.rider');if(rider)rider.style.setProperty('--lane',current().options.length===2?run.selected*2:run.selected);document.querySelectorAll('[data-answer]').forEach((b,j)=>b.classList.toggle('selected',j===run.selected));}
  function initCable(){
    run.snake=[{x:4,y:5},{x:3,y:5},{x:2,y:5},{x:1,y:5}];run.dir=[1,0];run.pendingDir=null;run.moving=false;run.snakeAt=performance.now();
    run.packets=[{x:11,y:2},{x:11,y:8},{x:7,y:5},{x:2,y:8}].slice(0,current().options.length);drawCable();
  }
  function drawCable(){const grid=document.querySelector('.cable-grid');if(!grid)return;grid.innerHTML=Array.from({length:165},(_,i)=>{const x=i%15,y=Math.floor(i/15),s=run.snake.findIndex(p=>p.x===x&&p.y===y),p=run.packets.findIndex(p=>p.x===x&&p.y===y);return `<span class="cell ${s===0?'head':s>0?'snake':p>=0?'packet':''}">${p>=0?p+1:''}</span>`;}).join('');}
  function steer(dir){if(!run||run.stage!=='question'||run.paused||!run.snake)return;if(dir[0]===-run.dir[0]&&dir[1]===-run.dir[1])return;run.pendingDir=dir;run.moving=true;}
  function cableStep(){
    if(!run.moving)return;
    if(run.pendingDir){run.dir=run.pendingDir;run.pendingDir=null;}
    const h=run.snake[0],n={x:(h.x+run.dir[0]+15)%15,y:(h.y+run.dir[1]+11)%11};
    if(run.snake.slice(0,-1).some(p=>p.x===n.x&&p.y===n.y)){run.moving=false;announce('Cable crossed itself. Choose a new direction.');return;}
    run.snake.unshift(n);run.snake.pop();drawCable();const packet=run.packets.findIndex(p=>p.x===n.x&&p.y===n.y);if(packet>=0)answer(packet);
  }
  function resumeTick(){
    stopTick();run.last=performance.now();
    tick=setInterval(()=>{
      if(!run||run.paused||document.hidden)return;
      const now=performance.now(),dt=Math.min(250,now-run.last);run.last=now;
      if(run.stage==='question'||run.stage==='drop'){
        if(run.mode==='train'){run.remaining=Math.max(0,run.remaining-dt/1000);const bar=document.getElementById('clockbar');if(bar)bar.style.width=(run.remaining/run.clock*100)+'%';if(run.remaining<=0){resolve(false,null,'Time’s up.');return;}}
        if(current().game==='cable'&&run.snake&&now-run.snakeAt>=230){run.snakeAt=now;cableStep();}
        if(run.stage==='drop'){run.dropTime=(run.dropTime||0)+dt;run.dropX=(Math.sin(run.dropTime/650)+1)*39;const block=document.querySelector('.moving-block');if(block)block.style.left=run.dropX+'%';}
      }
    },50);
  }
  function answer(index){
    if(!run||run.paused||run.stage!=='question')return;
    const q=current(),option=q.options[index];if(!option||run.used.includes(index))return;
    if(q.game==='relay'){
      if(option.index!==run.step){run.sequenceMiss=true;tone(false);announce('That is not the next step. Try another.');run.used.push(index);if(run.mode==='train')run.lives--;const b=document.querySelector(`[data-answer="${index}"]`);if(b){b.classList.add('incorrect');b.disabled=true;}if(run.mode==='train'&&run.lives<=0)resolve(false,index,'Review the complete runbook below.');return;}
      run.used.push(index);run.step++;tone(true);const slot=document.querySelectorAll('.relay-slot')[run.step-1];slot.classList.add('filled');slot.textContent=option.text;const b=document.querySelector(`[data-answer="${index}"]`);b.disabled=true;b.classList.add('correct');announce(`Step ${run.step} placed.`);
      if(run.step===q.steps.length)resolve(!run.sequenceMiss,index,run.sequenceMiss?'Runbook complete. You corrected a step along the way.':'Runbook complete.');
      return;
    }
    if(q.game==='tower'&&option.correct&&run.mode==='train'&&!reduced()){
      run.stage='drop';run.pendingAnswer=index;run.dropTime=0;run.moving=false;document.querySelectorAll('[data-answer]').forEach(b=>b.disabled=true);document.getElementById('feedback').innerHTML='<div class="feedback"><h3>Good response. Now build on it.</h3><p>Drop the module when it lines up with the highlighted center.</p><button class="btn primary" data-action="drop">Drop module · Space</button></div>';document.querySelector('[data-action="drop"]').focus();return;
    }
    resolve(option.correct,index);
  }
  function resolve(correct,index,message=''){
    if(!run||!['question','drop'].includes(run.stage))return;
    stopTick();run.stage='feedback';run.moving=false;const q=current(),o=index==null?null:q.options[index];
    run.answered++;run.combo=correct?run.combo+1:0;if(correct){run.correct++;run.score+=C.score(true,run.combo,run.mode==='train'?run.remaining:0);if(q.game==='tower')run.tower++;}else{if(run.mode==='train'&&!(q.game==='relay'&&run.sequenceMiss))run.lives=Math.max(0,run.lives-1);run.missed.push({prompt:q.prompt,answer:q.steps?q.steps.join(' → '):q.options.find(o=>o.correct)?.text||'',why:q.why});}
    const key=atomKey(q.atom);save.atoms[key]=C.updateAtom(save.atoms[key],correct,Date.now(),q.atom.hash);persist();tone(correct);
    document.getElementById('hud-score').textContent=run.score.toLocaleString();document.getElementById('hud-combo').textContent='×'+run.combo;
    if(run.mode==='train')document.getElementById('hud-lives').textContent='♥'.repeat(run.lives)+'♡'.repeat(3-run.lives);
    document.querySelectorAll('[data-answer]').forEach((b,i)=>{b.disabled=true;if(q.options[i].correct)b.classList.add('correct');else if(i===index)b.classList.add('incorrect');});
    const answer=q.steps?q.steps.join(' → '):q.options.find(o=>o.correct)?.text||'';
    document.getElementById('feedback').innerHTML=`<section class="feedback ${correct?'':'bad'}"><h3>${message|| (correct?'Nice work. Keep building.':'A useful one to practice again.')}</h3>${!correct?`<p><strong>${q.steps?'The right order':'Best answer'}:</strong> ${E(answer)}</p>`:''}${o?.reply?`<p class="reply">${E(q.persona)}: “${E(o.reply)}”</p>`:''}${run.mode!=='train'?`<p>${E(q.why)}</p>`:'<p>We’ll save the learning notes for your run review.</p>'}<button class="btn primary" data-action="next">${run.index+1===run.queue.length||run.lives<=0?'See results':'Next challenge'}</button></section>`;
    const feedback=document.querySelector('[data-action="next"]');feedback.focus();feedback.scrollIntoView({block:'nearest',behavior:reduced()?'instant':'smooth'});announce(correct?'Correct.':'Not quite. '+answer);
  }
  function finish(){
    stopTick();const r=run,cleared=r.game==='boss'&&r.correct/r.queue.length>=.8;
    save.xp+=r.score;const key=`${pack().id}:${moduleId}:${r.game}:${r.mode}`;save.bests[key]=Math.max(save.bests[key]||0,r.score);save.runs.push({game:r.game,mode:r.mode,course:pack().title,score:r.score,correct:r.correct,total:r.answered,at:Date.now()});save.runs=save.runs.slice(-30);persist();
    app.innerHTML=`<main class="result"><div class="eyebrow">${r.game==='boss'?(cleared?'CIRCUIT CLEARED':'CIRCUIT PRACTICED'):'PRACTICE MAKES PROGRESS'}</div><h1>${r.game==='boss'?(cleared?'You rose to the challenge.':'One more run. A little wiser.'):r.correct===r.queue.length?'That’s a clean run.':'A little better than before.'}</h1><p class="muted">${E(meta[r.game].name)} · ${E(module().title)} · ${E(r.mode)}</p><div class="big-score">${r.score.toLocaleString()} <span style="font-size:1.4rem;letter-spacing:0">XP</span></div><div class="stats"><div class="stat"><div><b>${r.correct} / ${r.answered}</b><span>Correct answers</span></div></div><div class="stat"><div><b>${r.answered?Math.round(r.correct/r.answered*100):0}%</b><span>Accuracy</span></div></div><div class="stat"><div><b>${r.queue.length-r.answered}</b><span>Challenges remaining</span></div></div></div>${r.game==='boss'?`<p class="muted">Circuit target: at least 80% of all ${r.queue.length} challenges (${Math.ceil(r.queue.length*.8)} correct).</p>`:''}<div class="run-controls"><button class="btn primary" data-start="${r.game}">Play again</button><button class="btn" data-action="home">Back to arcade</button></div><div class="section-head"><h2>${r.missed.length?'Take these into your next run':'Keep the habit going'}</h2></div>${r.missed.length?r.missed.map(m=>`<article class="review-item"><h3>${E(m.prompt)}</h3><p style="color:var(--lime)">${E(m.answer)}</p><p>${E(m.why)}</p></article>`).join(''):'<p class="muted">Come back tomorrow to strengthen recall. Practice across different days moves skills toward mastery.</p>'}${!storageOK?'<div class="notice">Your progress could not be saved. Export it from Settings before closing.</div>':''}</main>`;
    run=null;window.scrollTo(0,0);
  }
  function dialog(body,label){
    modalReturn=document.activeElement;
    const div=document.createElement('div');div.className='modal-backdrop';div.innerHTML=`<section class="modal" role="dialog" aria-modal="true" aria-label="${label}" tabindex="-1">${body}</section>`;document.body.append(div);div.querySelector('button,input')?.focus();
  }
  function closeDialog(){document.querySelector('.modal-backdrop')?.remove();modalReturn?.focus();}
  function pause(){if(!run)return;run.paused=true;stopTick();dialog('<h2>Take a breather.</h2><p>Your run is paused. Pick up right where you left off.</p><div class="run-controls"><button class="btn primary" data-action="resume">Resume run</button><button class="btn" data-action="leave">Leave run</button></div>','Run paused');}
  function settings(){dialog(`<h2>Make it your arcade.</h2><p>Choose how you play. All content and progress stay on your device.</p><label class="setting">Sound effects <input type="checkbox" id="sound" ${save.settings.sound?'checked':''}></label><label class="setting">Calm visuals & direct cable controls <input type="checkbox" id="motion" ${save.settings.motion?'checked':''}></label><p>System reduced-motion preferences are respected automatically.</p><button class="btn" data-action="export">Export progress</button><p>Save a JSON copy of your progress for safekeeping.</p><button class="btn primary" data-action="close">Done</button>`,'Arcade settings');}
  function recommended(){
    const now=Date.now();let found;
    for(let i=0;i<packs.length;i++){const a=packs[i].atoms.find(a=>save.atoms[`${packs[i].id}:${a.id}`]?.due<=now&&a.type!=='flawed_example');if(a){found={i,a};break;}}
    if(found){course=found.i;moduleId=found.a.module;start(found.a.type==='scenario'?'tower':found.a.type==='sequence'?'relay':found.a.type==='category'?'cable':'bridge');}else start('bridge');
  }
  document.addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b||b.disabled)return;
    if(b.dataset.page){page=b.dataset.page;render();window.scrollTo(0,0);}
    if(b.dataset.course){course=+b.dataset.course;moduleId=pack().modules[0].id;render();}
    if(b.dataset.mode){save.settings.mode=b.dataset.mode;persist();render();}
    if(b.dataset.start)start(b.dataset.start);
    if(b.dataset.answer!==undefined)answer(+b.dataset.answer);
    if(b.dataset.dir)steer(b.dataset.dir.split(',').map(Number));
    switch(b.dataset.action){
      case'recommended':recommended();break;
      case'ready':run.stage='question';drawRun();break;
      case'next':run.index++;run.sequenceMiss=false;next();window.scrollTo(0,0);break;
      case'home':stopTick();run=null;page='arcade';render();window.scrollTo(0,0);break;
      case'pause':pause();break;
      case'resume':closeDialog();run.paused=false;if(['question','drop'].includes(run.stage))resumeTick();break;
      case'leave':closeDialog();stopTick();run=null;page='arcade';render();break;
      case'settings':settings();break;
      case'close':closeDialog();render();break;
      case'drop':if(run?.stage==='drop'){const bonus=Math.abs(run.dropX-39)<12?75:20;run.score+=bonus;resolve(true,run.pendingAnswer,bonus===75?'Perfect placement. +75 XP':'Module placed. +20 XP');}break;
      case'export':{const url=URL.createObjectURL(new Blob([JSON.stringify({...save,version:1},null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='endsight-arcade-progress.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);break;}
    }
  });
  document.addEventListener('change',e=>{if(e.target.id==='module'){moduleId=e.target.value;render();}if(e.target.id==='sound'||e.target.id==='motion'){save.settings[e.target.id]=e.target.checked;persist();applyMotion();}});
  document.addEventListener('keydown',e=>{
    const modal=document.querySelector('.modal');
    if(modal){if(e.key==='Tab'){const nodes=[...modal.querySelectorAll('button,input')].filter(b=>!b.disabled),first=nodes[0],last=nodes.at(-1);if(e.shiftKey&&document.activeElement===first){last.focus();e.preventDefault();}else if(!e.shiftKey&&document.activeElement===last){first.focus();e.preventDefault();}}if(e.key==='Escape'&&!run){closeDialog();render();}return;}
    if(!run||run.paused||e.ctrlKey||e.metaKey||e.altKey)return;
    if(e.key==='Escape'){pause();return;}
    if(run.stage==='drop'&&e.key===' '){e.preventDefault();document.querySelector('[data-action="drop"]').click();return;}
    if(run.stage!=='question'||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;
    const q=current();
    if(/^[1-9]$/.test(e.key)){e.preventDefault();answer(+e.key-1);return;}
    if(q.game==='bridge'&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();selectLane(run.selected+(e.key==='ArrowLeft'?-1:1));}
    if(q.game==='bridge'&&e.key==='Enter'&&e.target.tagName!=='BUTTON'){e.preventDefault();answer(run.selected);}
    if(q.game==='cable'&&!reduced()){const dir={ArrowLeft:[-1,0],a:[-1,0],ArrowRight:[1,0],d:[1,0],ArrowUp:[0,-1],w:[0,-1],ArrowDown:[0,1],s:[0,1]}[e.key];if(dir){e.preventDefault();steer(dir);}}
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&run&&!run.paused)pause();});
  render();
})();
