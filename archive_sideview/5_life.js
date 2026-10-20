/* ================= LIFE & PERSONALITY: energy/mood (simulated), rest, meals, meetings, friendship, banter, Den Den Mushi ================= */
const MEETING={active:false};let MEAL=null,COMBO=null;
const AYE={luffy:"Shishishi!",nami:"Got it.",zoro:"Hmph.",usopp:"Leave it to me!",sanji:"Yes, captain.",chopper:"On it!",robin:"Fufu.",brook:"Yohoho!",jinbe:"Understood."};
const THANKS={luffy:"MEAT!! Thanks, Sanji!",nami:"Thanks, Sanji-kun!",zoro:"Not bad, cook.",usopp:"Delicious!",chopper:"Yummy!",robin:"Lovely, thank you.",brook:"Yohoho, a feast!",jinbe:"Much obliged."};
function moodOf(a){const e=a.energy;return a.resting?"Resting":a.eating?"Eating":e>70?"Fired up":e>45?"Focused":e>25?"Tired":"Exhausted";}
const freeSpot=(a,keys)=>keys.find(k=>!agents.some(o=>o!==a&&(o.at===k||(o.path.length&&o.target===k))));
/* --- energy (simulated, labelled as such in the UI) --- */
let enSave=0;
HOOK.tick.push(dt=>{const s=dt/1000;agents.forEach(a=>{let d=a.resting?0.9:a.eating?0.6:a.anim?-0.12:a.walking?-0.05:-0.03;if(a.state==="needs_decision")d-=0.01;a.energy=Math.max(0,Math.min(100,a.energy+d*s));});
  enSave+=dt;if(enSave>10000){enSave=0;agents.forEach(a=>LS.set("energy."+a.id,Math.round(a.energy)));}});
/* --- what to do next (called whenever an agent's idle wait ends) --- */
function chooseNext(a){
  if(MEETING.active){const s=MEETING.spots[a.id];return a.at===s?false:s;}
  if(COMBO&&COMBO.ids.includes(a.id))return false;
  if(a.jobQueue&&a.jobQueue.length){sendToBoard(a,a.jobQueue.shift());return false;}
  if(a.resting){if(a.energy<90)return false;a.resting=false;say(a,"Refreshed!",2500);return a.home;}
  if(MEAL&&a.id==="sanji")return a.at==="galley"?false:"galley";
  if(MEAL&&a.ateKey!==MEAL.key){const s=freeSpot(a,["meal1","meal2","meal3","meal4"]);if(s){a.ateKey=MEAL.key;a.onArrive=x=>{x.eating=true;x.energy=Math.min(100,x.energy+25);say(x,THANKS[x.id]||"Thanks!",3500);x.wait=9000;setTimeout(()=>x.eating=false,9000);};return s;}}
  if(a.energy<25){const s=freeSpot(a,["rest1","rest2"]);if(s){say(a,"So tired…",2500);a.onArrive=x=>{x.resting=true;say(x,"Taking a break… zzz",3000);addLog(x.name,"Taking a break on the lawn (energy low)");};return s;}}
  return null;}
/* --- meals at São Paulo meal times --- */
function mealNow(){const n=spNow(),m=n.h*60+n.mi;for(const [h1,m1,h2,m2,name] of CONFIG.meals)if(m>=h1*60+m1&&m<h2*60+m2)return {name,key:n.date+"-"+name};return null;}
function mealStart(log){banner("meal","🍖 "+MEAL.name.toUpperCase()+" IS SERVED · Sanji's galley");if(log)addLog("Sanji",MEAL.name+" is served in the galley"+(MEAL.manual?" (manual)":""));
  const s=agents.find(a=>a.id==="sanji");if(s)goTo(s,"galley",x=>{say(x,"Come and get it! "+MEAL.name+"!",5000);x.wait=3000;});
  agents.forEach(a=>{if(!a.walking&&!a.anim&&a.id!=="sanji"&&!MEETING.active)a.wait=Math.min(a.wait,800+Math.random()*5000);});}
function serveMeal(name){MEAL={name,key:"manual-"+Date.now(),manual:true,until:performance.now()+60000};mealStart(true);}
function mealCheck(){const w=mealNow();
  if(MEAL&&MEAL.manual){if(performance.now()>MEAL.until){MEAL=null;banner("meal",null);}return;}
  if(w&&(!MEAL||MEAL.key!==w.key)){MEAL=w;const k="meal."+w.key;mealStart(!LS.get(k,false));LS.set(k,true);}
  else if(!w&&MEAL){MEAL=null;banner("meal",null);}}
/* --- crew meetings at the mast: morning plan, Friday summary replay, weekly MVP ceremony --- */
const dateKey=v=>{const d=parseDate(v);return d?d.toISOString().slice(0,10):String(v||"");};
function latestSummary(){const f=FEEDS.summaries;if(!f||!f.ok||!f.rows.length)return null;const r=f.rows.filter(x=>x.text).sort((a,b)=>(parseDate(b.date)||0)-(parseDate(a.date)||0))[0];return r?{date:parseDate(r.date)?fmtDay(parseDate(r.date)):String(r.date),text:String(r.text)}:null;}
function meetingLines(kind){
  if(kind==="morning"){const b=FEEDS.briefing;let lines=[],src;
    if(b&&b.ok&&b.rows.length){const rows=b.rows.map(r=>({d:dateKey(r.date),l:String(r.line||"")})).filter(r=>r.l);const ds=[...new Set(rows.map(r=>r.d))].sort(),today=spNow().date,d=ds.includes(today)?today:ds[ds.length-1];lines=rows.filter(r=>r.d===d).map(r=>r.l);src="BRIEFING tab ("+d+")";}
    else if(STATUS.briefing&&STATUS.briefing.length){lines=STATUS.briefing.slice();src="status.json briefing";}
    else{lines=agents.filter(a=>a.id!=="luffy").map(a=>`${a.name}: ${a.status}`);src="current crew statuses";}
    return {lines:["Good morning, crew! Today's plan:",...lines,"Let's get to work!"],src};}
  if(kind==="summary"){const s=latestSummary();if(!s)return null;return {lines:["Friday summary, "+s.date+":",...s.text.split(/(?<=[.!?])\s+|\n+/).map(x=>x.trim()).filter(Boolean),"Great week, everyone!"],src:"SUMMARIES tab"};}
  const m=weeklyMVP();if(!m)return {lines:["Weekly MVP ceremony!","No deliveries logged this week, so no MVP yet.","Next week, crew!"],src:"real event counts",mvp:null};
  return {lines:["Weekly MVP ceremony!",`This week's MVP: ${m.a.name}, with ${m.n} deliver${m.n>1?"ies":"y"}!`,"Three cheers! Kanpai!"],src:"real event counts",mvp:m};}
const MEET_TITLE={morning:"☀ MORNING CREW MEETING",summary:"📜 FRIDAY SUMMARY REPLAY",ceremony:"👑 WEEKLY MVP CEREMONY"};
function startMeeting(kind){if(MEETING.active)return false;const L=meetingLines(kind);if(!L){banner("meet","No SUMMARIES tab yet: nothing to replay",3500);return false;}
  const lead=agents.find(a=>a.id==="luffy"),rest=agents.filter(a=>a!==lead),spots={luffy:"m0"};rest.forEach((a,i)=>spots[a.id]="m"+(i+1));
  if(L.mvp&&L.mvp.a!==lead){const k=Object.keys(spots).find(id=>spots[id]==="m4");spots[k]=spots[L.mvp.a.id];spots[L.mvp.a.id]="m4";}
  Object.assign(MEETING,{active:true,kind,lines:L.lines,src:L.src,idx:-1,t0:performance.now(),next:0,mvp:L.mvp||null,spots});
  COMBO=null;agents.forEach(a=>{a.resting=false;a.eating=false;a.combo=null;goTo(a,spots[a.id],x=>{x.wait=1e9;x.dir="down";});});
  banner("meet",MEET_TITLE[kind]+" · "+L.src);addLog("Luffy",MEET_TITLE[kind].slice(2).toLowerCase().replace(/^./,c=>c.toUpperCase())+" at the mast ("+L.src+")");return true;}
function endMeeting(){const k=MEETING.kind;MEETING.active=false;banner("meet",null);agents.forEach(a=>a.wait=500+Math.random()*4000);
  if(k==="morning"&&MEETING.thenSummary){MEETING.thenSummary=false;setTimeout(()=>startMeeting("summary"),6000);}}
HOOK.tick.push(()=>{if(!MEETING.active)return;const now=performance.now(),lead=agents.find(a=>a.id==="luffy");
  if(MEETING.idx<0){if(agents.every(a=>a.at===MEETING.spots[a.id]&&!a.path.length)||now-MEETING.t0>35000){MEETING.idx=0;MEETING.next=now;const ids=agents.map(a=>a.id);for(let i=0;i<ids.length;i++)for(let j=i+1;j<ids.length;j++)addFriend(ids[i],ids[j],2,"meetings",true);}return;}
  if(now<MEETING.next)return;
  if(MEETING.idx>=MEETING.lines.length){endMeeting();return;}
  say(lead,MEETING.lines[MEETING.idx],3700);if(MEETING.idx>0&&Math.random()<.6){const o=agents.filter(a=>a!==lead),p=o[Math.floor(Math.random()*o.length)];setTimeout(()=>say(p,AYE[p.id]||"Aye!",1800),1600);}
  MEETING.idx++;MEETING.next=now+3900;
  if(MEETING.kind==="ceremony"&&MEETING.mvp&&MEETING.idx===2){const m=MEETING.mvp;confetti();LS.set("mvp",{week:weekKey(),crew:m.a.id,n:m.n});LS.set("mvpEver",true);addLog("Luffy",`${m.a.name} crowned weekly MVP (${m.n} deliveries this week)`);renderAchievements();setTimeout(()=>say(m.a,"Thanks, crew!",3000),1200);}});
/* --- friendship (grows from meeting co-attendance, brainstorms and combos) --- */
const fkey=(a,b)=>[a,b].sort().join("|"),flvl=p=>Math.min(5,Math.floor(Math.sqrt(p/2)));
const friendPts=(a,b)=>LS.get("friends",{})[fkey(a,b)]||0;
function addFriend(a,b,n,why,quiet){const f=LS.get("friends",{}),k=fkey(a,b),before=flvl(f[k]||0);f[k]=(f[k]||0)+n;LS.set("friends",f);if(!quiet&&flvl(f[k])>before)addLog("System",`${nameOf(a)} & ${nameOf(b)} reached friendship level ${flvl(f[k])} (${why})`);}
function topFriends(a,n=3){return agents.filter(o=>o!==a).map(o=>({o,p:friendPts(a.id,o.id)})).filter(x=>x.p>0).sort((x,y)=>y.p-x.p).slice(0,n).map(x=>x.o.name+" "+("♥".repeat(Math.max(1,flvl(x.p)))));}
const brainCD={};
setInterval(()=>{if(MEETING.active)return;const idle=agents.filter(a=>!a.walking&&!a.anim&&!a.resting);
  for(let i=0;i<idle.length;i++)for(let j=i+1;j<idle.length;j++){const a=idle[i],b=idle[j];if(levelOf(a.y)!==levelOf(b.y)||Math.abs(a.x-b.x)>36)continue;const k=fkey(a.id,b.id);if(brainCD[k]&&performance.now()-brainCD[k]<180000)continue;brainCD[k]=performance.now();
    addFriend(a.id,b.id,1,"brainstorms");a.brain=b.brain=performance.now();if(Math.random()<.4)say(a,"Hey "+b.name+", got a sec? 💡",2600);}},15000);
/* --- banter & combos --- */
const COMBOS={
  bicker:{ids:["zoro","sanji"],log:"Zoro and Sanji bickered on deck",lines:[["zoro","What are you looking at, curly brow?"],["sanji","Huh?! Wanna go, moss head?"],["zoro","Bring it."],["sanji","…Later. Lunch first."]]},
  goof:{ids:["luffy","usopp"],log:"Luffy and Usopp goofed around on deck",lines:[["luffy","Usopp! Chopstick-nose dance!"],["usopp","♪ I'm the great Captain Usopp! ♪"],["luffy","Shishishi!"],["usopp","Hahaha! Encore!"]]}};
function triggerCombo(type,manual){if(COMBO||MEETING.active)return false;const C=COMBOS[type],[A,B]=C.ids.map(id=>agents.find(a=>a.id===id));if(!A||!B||A.anim||B.anim)return false;
  COMBO={type,ids:C.ids,arrived:new Set(),manual};[[A,"c1"],[B,"c2"]].forEach(([a,s])=>{a.resting=false;goTo(a,s,x=>{x.wait=1e9;COMBO&&COMBO.arrived.add(x.id);if(COMBO&&COMBO.arrived.size===2)runCombo(C,A,B);});});
  const me=COMBO;setTimeout(()=>{if(COMBO===me&&!A.combo){COMBO=null;A.wait=B.wait=1000;}},40000);return true;}
function runCombo(C,A,B){const t0=performance.now(),dur=C.lines.length*2400+600;A.dir="right";B.dir="left";A.combo=B.combo={type:COMBO.type,t0,dur};
  C.lines.forEach(([id,l],i)=>setTimeout(()=>say(id===A.id?A:B,l,2300),i*2400));if(COMBO.type==="goof")[523,659,523,784].forEach((f,i)=>setTimeout(()=>beep(f,.07),i*200));else[200,180].forEach((f,i)=>setTimeout(()=>beep(f,.1,"sawtooth"),i*250));
  setTimeout(()=>{A.combo=B.combo=null;A.wait=1200;B.wait=2500;addFriend(A.id,B.id,3,"combos");addLog(A.name,C.log+(COMBO&&COMBO.manual?" (preview)":""));COMBO=null;},dur);}
setInterval(()=>{if(MEETING.active||COMBO||MEAL)return;const type=Math.random()<.5?"bicker":"goof",[A,B]=COMBOS[type].ids.map(id=>agents.find(a=>a.id===id));if(!A||!B||A.resting||B.resting||A.walking||B.walking)return;
  if(Math.random()<0.15+flvl(friendPts(A.id,B.id))*0.03)triggerCombo(type,false);},60000);
function comboDy(a,t){if(!a.combo)return 0;const e=t-a.combo.t0;if(a.combo.type==="goof")return -Math.round(Math.abs(Math.sin(e/140+(a.id==="usopp"?1.6:0)))*4);return Math.floor(e/90)%6===0?-1:0;}
/* --- Den Den Mushi on each desk: rings when the crew state is needs_decision --- */
const DDM={luffy:[146,110],nami:[200,100],zoro:[126,179],usopp:[215,12],sanji:[93,150],chopper:[293,151],robin:[177,150],brook:[377,111],jinbe:[294,188]};
const dHash=s=>{let h=0;for(const c of String(s))h=(h*31+c.charCodeAt(0))|0;return String(h);};
const ringing=a=>(a.testRing&&performance.now()<a.testRing)||(a.state==="needs_decision"&&a.decision&&LS.get("dread."+a.id,null)!==dHash(a.decision));
let ringBeep=0;
HOOK.ship.push(t=>{let any=false;agents.forEach(a=>{const p=DDM[a.id];if(!p)return;const r=ringing(a);any=any||r;const sx=r?(Math.floor(t/70)%2?1:-1):0,x=p[0]+sx,y=p[1];
  R(ctx,x,y+3,9,2,"#d9a77a");R(ctx,x,y+5,9,1,OUTL);R(ctx,x+7,y,2,4,"#d9a77a");R(ctx,x+7,y-2,1,2,"#d9a77a");R(ctx,x+9,y-2,1,2,"#d9a77a");R(ctx,x+7,y-3,1,1,OUTL);R(ctx,x+9,y-3,1,1,OUTL);
  disc(ctx,x+3,y+1,3,"#3fa9f5");disc(ctx,x+3,y+1,1,"#1f5f9a");R(ctx,x,y-3,6,1,"#2a2a2a");R(ctx,x,y-3,1,2,"#2a2a2a");R(ctx,x+5,y-3,1,2,"#2a2a2a");
  if(r){const ph=Math.floor(t/200)%2;R(ctx,x-3,y-2+ph,2,1,"#fff");R(ctx,x+11,y-3+ph,2,1,"#fff");R(ctx,x-4,y+1-ph,2,1,"#fff");R(ctx,x+12,y,2,1,"#fff");if(Math.floor(t/600)%2)R(ctx,x+2,y-8,5,4,"#ffd24a"),R(ctx,x+4,y-7,1,2,OUTL);}});
  if(any&&t-ringBeep>2500){ringBeep=t;beep(1320,.05);setTimeout(()=>beep(990,.05),110);}});
function snailAt(ev){const r=cv.getBoundingClientRect(),x=(ev.clientX-r.left)*W/r.width,y=(ev.clientY-r.top)*H/r.height-BOB;return agents.find(a=>{const p=DDM[a.id];return p&&x>p[0]-2&&x<p[0]+12&&y>p[1]-5&&y<p[1]+7;});}
cv.addEventListener("click",ev=>{const a=snailAt(ev);if(!a||(!ringing(a)&&hitAt(ev)))return;ev.stopImmediatePropagation();openDecision(a);},true);
cv.addEventListener("mousemove",ev=>{if(snailAt(ev))cv.style.cursor="pointer";});
function openDecision(a){const b=el("div");const test=a.testRing&&performance.now()<a.testRing;a.testRing=0;
  if(a.state==="needs_decision"&&a.decision){b.append(el("div",{class:"note"},`${a.name} (${a.role}) needs a decision:`),el("p",{style:"font-size:20px"},a.decision),el("div",{class:"note"},"Source: CREW STATUS tab (state = needs_decision). Opening this marks it as read on this browser; the ring returns if the decision text changes."));LS.set("dread."+a.id,dHash(a.decision));}
  else b.append(el("p",{},test?"Test ring: no decision is pending.":`No decision needed from ${a.name} right now (state: ${a.state||"working"}).`),el("div",{class:"note"},"Set state = needs_decision and a decision text in the CREW STATUS tab to make this Den Den Mushi ring."));
  openModal("DEN DEN MUSHI · "+a.name.toUpperCase(),b,true);}
/* --- small life effects: zzz, plates, brainstorm bulbs, combo sparks --- */
HOOK.fx.push(t=>{agents.forEach(a=>{const L=LOOKS[a.id],top=Math.round(a.y-(L.tall?30:L.short?22:25)),x=Math.round(a.x);
  if(a.resting){const p=(t/1600)%1;[0,.33,.66].forEach(o=>{const q=(p+o)%1;const zx=x+4+Math.round(q*8),zy=top-2-Math.round(q*12);R(ctx,zx,zy,3,1,"#fff");R(ctx,zx+1,zy+1,1,1,"#fff");R(ctx,zx,zy+2,3,1,"#fff");});}
  if(a.eating&&a.at&&/^meal/.test(a.at)){R(ctx,x-3,152,7,1,"#fff");R(ctx,x-2,151,5,1,"#c8642a");R(ctx,x-1,150,2,1,"#57c26a");if(Math.floor(t/300)%2)R(ctx,x,147,1,2,"rgba(255,255,255,.7)");}
  if(a.brain&&t-a.brain<2500){disc(ctx,x,top-6,2,"#ffe680");R(ctx,x-1,top-3,3,2,"#bbb");}
  if(a.combo&&a.combo.type==="bicker"&&a.id==="zoro"){const o=agents.find(b=>b.id==="sanji");if(o&&Math.floor(t/120)%3){let px=x+6,py=top+8;for(let i=0;i<5;i++){const nx=px+Math.round((o.x-6-x-6)/5),ny=top+8+(i%2?-3:3);line(ctx,px,py,nx,ny,"#ffd24a");px=nx;py=ny;}R(ctx,x-6,top-1,3,1,"#e0424f");R(ctx,x-5,top-2,1,3,"#e0424f");R(ctx,Math.round(o.x)+5,top-1,3,1,"#e0424f");R(ctx,Math.round(o.x)+6,top-2,1,3,"#e0424f");}}
  if(a.combo&&a.combo.type==="goof"){const q=((t-a.combo.t0)/900+(a.id==="usopp"?.5:0))%1;note(ctx,x+(a.id==="usopp"?6:-10),top-4-Math.round(q*10),"#fff");}
  if(MEAL&&a.id==="sanji"&&a.at==="galley"&&!a.walking){R(ctx,x+5,top+13,8,1,"#fff");disc(ctx,x+9,top+11,2,"#c8642a");if(Math.floor(t/250)%2)R(ctx,x+9,top+6,1,3,"rgba(255,255,255,.7)");}});});
/* --- schedules (São Paulo time) --- */
function schedule(){mealCheck();const n=spNow(),weekday=["Mon","Tue","Wed","Thu","Fri"].includes(n.wd);
  if(weekday&&n.h===CONFIG.meetingHour&&n.mi<20&&!LS.get("meet."+n.date,false)&&!MEETING.active){LS.set("meet."+n.date,true);if(startMeeting("morning")&&n.wd==="Fri"&&latestSummary())MEETING.thenSummary=true;}
  if(n.wd==="Fri"&&n.h>=16&&!LS.get("ceremony."+weekKey(),false)&&!MEETING.active){LS.set("ceremony."+weekKey(),true);if(weeklyMVP())startMeeting("ceremony");else addLog("System","Friday MVP ceremony skipped: no real deliveries logged this week");}}
HOOK.boot.push(()=>{schedule();setInterval(schedule,20000);});
setInterval(()=>{document.querySelectorAll("#roster .energy").forEach(e=>{const a=agents.find(x=>x.id===e.dataset.id);if(a){e.firstChild.style.width=a.energy+"%";e.firstChild.style.background=a.energy>45?"#4e9a36":a.energy>25?"#e3b444":"#c8323c";e.title="Energy "+Math.round(a.energy)+"% · "+moodOf(a)+" (simulated)";e.nextSibling.textContent=" "+moodOf(a);}});},2000);
