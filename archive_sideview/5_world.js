/* ================= WORLD: big-deal fireworks, confetti, rare sea events, seasonal decor & outfits ================= */
const WORLD={bobAmp:1.5,storm:null,seaking:null,marine:null,bottle:null,fireworks:[],confetti:[]};
/* --- fireworks + Chopper runs to Luffy on a big discount --- */
function bigDeal(a,d,preview){const until=performance.now()+7000;WORLD.fwUntil=until;banner("deal",`🎆 BIG DEAL: ${Math.round(d)}% OFF`+(preview?" (preview)":""),7000);
  if(!preview)addLog("Chopper",`Big deal alert: ${Math.round(d)}% below average. Ran to tell Luffy`);
  const c=agents.find(x=>x.id==="chopper"),l=agents.find(x=>x.id==="luffy");if(!c||!l)return;
  setTimeout(()=>{const ls=SPOTS[(!l.path.length&&l.at)||l.target||l.home]||SPOTS[l.home];SPOTS.toLuffy={x:ls.x>380?ls.x-14:ls.x+14,y:ls.y,label:"running to tell Luffy"};
    if(levelOf(ls.y)===0)SPOTS.toLuffy.x=ls.x===222?236:ls.x-14;
    goTo(c,"toLuffy",x=>{say(x,`Luffy! ${Math.round(d)}% off!!`,3500);x.dir=x.x>l.x?"left":"right";setTimeout(()=>say(l,"Shishishi! Nice, Chopper!",3000),1200);x.wait=5000;},true);},EVENTS.deal_found.dur||2600);}
function spawnFirework(){const x=60+Math.random()*360,y=20+Math.random()*50,c=["#ffd24a","#ff6b6b","#7fc8ff","#a6f27c","#ff9ef0"][Math.floor(Math.random()*5)];
  for(let i=0;i<22;i++){const an=i/22*Math.PI*2,v=26+Math.random()*16;WORLD.fireworks.push({x,y,vx:Math.cos(an)*v,vy:Math.sin(an)*v,life:900+Math.random()*400,c});}beep(300+Math.random()*300,.05,"triangle");}
function confetti(){for(let i=0;i<90;i++)WORLD.confetti.push({x:150+Math.random()*180,y:20+Math.random()*30,vx:(Math.random()-.5)*40,vy:Math.random()*10,life:3500+Math.random()*1500,c:["#ffd24a","#ff6b6b","#7fc8ff","#a6f27c","#fff"][i%5]});banner("cf","🎉",2000);}
let fwT=0;
HOOK.tick.push(dt=>{const now=performance.now();if(WORLD.fwUntil&&now<WORLD.fwUntil){fwT-=dt;if(fwT<=0){spawnFirework();fwT=350+Math.random()*350;}}
  const step=(arr,g)=>{for(let i=arr.length-1;i>=0;i--){const p=arr[i];p.life-=dt;if(p.life<=0){arr.splice(i,1);continue;}p.vy+=g*dt/1000;p.x+=p.vx*dt/1000;p.y+=p.vy*dt/1000;}};step(WORLD.fireworks,30);step(WORLD.confetti,18);
  WORLD.bobAmp=WORLD.storm&&now<WORLD.storm.until?3.5:1.5;});
HOOK.sky.push(t=>{WORLD.fireworks.forEach(p=>{R(ctx,p.x|0,p.y|0,p.life>500?2:1,p.life>500?2:1,p.c);});});
HOOK.overlay.push(t=>{WORLD.confetti.forEach(p=>{R(ctx,p.x|0,p.y|0,2,Math.floor(t/120+p.x)%2?2:1,p.c);});});
/* --- rare random events --- */
function newsRows(){const f=FEEDS.news;return f&&f.ok?f.rows.filter(r=>r.headline&&String(r.headline).trim()):[];}
function startWorld(kind){const now=performance.now();
  if(kind==="storm"){WORLD.storm={t0:now,until:now+25000};banner("w","⛈ STORM! Batten down the hatches",6000);addLog("Usopp","A storm rolled in!");const z=agents.find(a=>a.id==="nami");if(z)say(z,"Storm ahead! Trim the sail!",3500);}
  if(kind==="seaking"){WORLD.seaking={t0:now,dur:11000,dir:Math.random()<.5?1:-1};banner("w","🐉 SEA KING SIGHTED!",5000);addLog("Usopp","S-S-SEA KING!! (it swam off)");const u=agents.find(a=>a.id==="usopp");if(u)say(u,"S-S-SEA KING!!",3500);const l=agents.find(a=>a.id==="luffy");if(l)setTimeout(()=>say(l,"Ooh! Can we eat it?",3000),1800);}
  if(kind==="marine"){WORLD.marine={t0:now,dur:45000};banner("w","⚓ Navy-style ship on the horizon",5000);addLog("Usopp","Spotted a navy-style ship on the horizon (just passing)");const u=agents.find(a=>a.id==="usopp");if(u)say(u,"Ship on the horizon!",3000);}
  if(kind==="bottle"){const n=newsRows();if(!n.length)return false;const r=n[Math.floor(Math.random()*n.length)];WORLD.bottle={t0:now,x:470,headline:String(r.headline),source:r.source?String(r.source):"",link:safeLink(r.link),date:r.date?String(r.date):""};banner("w","🍾 A message in a bottle! Click it",6000);}
  return true;}
setInterval(()=>{if(!CONFIG.randomEvents||document.hidden||MEETING.active)return;if(WORLD.storm&&performance.now()<WORLD.storm.until)return;if(Math.random()>0.1)return;
  const pool=["seaking","seaking","marine","marine","storm"];if(newsRows().length&&!WORLD.bottle)pool.push("bottle","bottle");startWorld(pool[Math.floor(Math.random()*pool.length)]);},60000);
HOOK.horizon.push(t=>{const M=WORLD.marine;if(!M)return;const p=(performance.now()-M.t0)/M.dur;if(p>1){WORLD.marine=null;return;}const x=Math.round(490-p*540),y=146;
  R(ctx,x,y,22,3,"#6b6f78");R(ctx,x+2,y+3,18,1,"#4a4e56");R(ctx,x+9,y-12,1,12,"#5a3a20");R(ctx,x+4,y-11,11,7,"#f4f4f4");R(ctx,x+4,y-8,11,1,"#2f5f9a");R(ctx,x+16,y-3,5,3,"#8a8e98");R(ctx,x+17,y-6,2,3,"#5a5e66");});
HOOK.sea.push(t=>{const now=performance.now();
  const S=WORLD.seaking;if(S){const p=(now-S.t0)/S.dur;if(p>1)WORLD.seaking=null;else{const head=S.dir>0?-40+p*560:520-p*560,rise=Math.sin(Math.min(1,p*1.2)*Math.PI);
    for(let i=0;i<6;i++){const hx=Math.round(head-S.dir*(16+i*16)),hy=Math.round(236-Math.max(0,Math.sin(i*1.3-now/300))*6*rise);disc(ctx,hx,hy,5,"#6a3fa0");disc(ctx,hx,hy-1,3,"#8e62c8");R(ctx,hx-1,hy-6,2,2,"#e0424f");}
    const hy=Math.round(232-rise*16),hx=Math.round(head);disc(ctx,hx,hy,8,"#6a3fa0");disc(ctx,hx-1,hy-2,5,"#8e62c8");R(ctx,hx+S.dir*5-1,hy-4,3,3,"#ffd24a");R(ctx,hx+S.dir*5,hy-3,1,1,OUTL);
    R(ctx,hx+S.dir*3-3,hy+3,7,2,"#fff");for(let k=-3;k<4;k+=2)R(ctx,hx+S.dir*3+k,hy+5,1,1,"#fff");R(ctx,hx-S.dir*3,hy-11,2,4,"#e0424f");R(ctx,hx-S.dir*6,hy-9,2,3,"#e0424f");
    for(let k=0;k<6;k++)R(ctx,hx-10+k*4,hy+8+(k%2),3,1,"rgba(255,255,255,.8)");}}
  const B=WORLD.bottle;if(B){B.x-=0.15;if(B.x<-20){WORLD.bottle=null;}else{const x=Math.round(B.x),y=226+Math.round(Math.sin(now/500)*2);R(ctx,x,y,8,4,"#3c9a4a");R(ctx,x+1,y+1,6,1,"#7fd08a");R(ctx,x+8,y+1,3,2,"#3c9a4a");R(ctx,x+11,y+1,1,2,"#a8703a");R(ctx,x+2,y+1,4,2,"#f3dfb0");if(Math.floor(now/500)%2)R(ctx,x+3,y-5,2,3,"#ffd24a");}}
  const St=WORLD.storm;if(St){if(now>St.until)WORLD.storm=null;else{const fade=Math.min(1,(now-St.t0)/2500,(St.until-now)/2500);ctx.fillStyle=`rgba(18,24,44,${(.45*fade).toFixed(3)})`;ctx.fillRect(0,0,W,H);
    ctx.fillStyle=`rgba(190,210,255,${(.6*fade).toFixed(3)})`;for(let i=0;i<90;i++){const rx=((i*53+now*0.25)%(W+40))-20,ry=((i*97+now*0.55)%H);ctx.fillRect(rx|0,ry|0,1,4);}
    if(Math.floor(now/97)%53===0){ctx.fillStyle="rgba(255,255,255,.5)";ctx.fillRect(0,0,W,H);if(Math.random()<.3)beep(80,.25,"sawtooth");}}}});
cv.addEventListener("click",ev=>{const B=WORLD.bottle;if(!B)return;const r=cv.getBoundingClientRect(),x=(ev.clientX-r.left)*W/r.width,y=(ev.clientY-r.top)*H/r.height;if(x>B.x-4&&x<B.x+16&&y>218&&y<236){ev.stopImmediatePropagation();
  const b=el("div",{},el("div",{class:"note"},"Real headline from the NEWS tab"+(B.date?" · "+B.date:"")),el("p",{style:"font-size:22px"},B.headline),B.source?el("div",{class:"note"},"Source: "+B.source):"");if(B.link)b.append(el("a",{href:B.link,target:"_blank",rel:"noopener"},"Read more ↗"));
  WORLD.bottle=null;addLog("Brook","Fished a message in a bottle: "+short(B.headline,60));openModal("MESSAGE IN A BOTTLE",b,true);}},true);
/* --- seasonal decor & outfits (auto by São Paulo month; override in EVENTS & PREVIEWS) --- */
function seasonNow(){const s=LS.get("season",CONFIG.season)||"auto";if(s!=="auto")return s;const m=spNow().m;return m===10?"halloween":m===12?"christmas":m===2?"carnival":m===6?"festa_junina":"off";}
let SEASON="off";setInterval(()=>SEASON=seasonNow(),30000);HOOK.boot.push(()=>SEASON=seasonNow());
function costume(g,id,phase,dir){if(SEASON==="off")return;const L=LOOKS[id];const oy=23+(L.short?2:L.tall?-4:0),bt=oy+12+(L.short?-1:0);
  if(SEASON==="halloween"&&((phase==="back")!==(dir==="up"))){R(g,10,bt,16,8+(L.tall?4:0),"#4a1f6a");R(g,10,bt,16,1,"#f5961e");R(g,10,bt+7+(L.tall?4:0),16,1,"#2a0f3a");}
  if(SEASON==="christmas"&&phase==="front"){R(g,12,bt,12,2,"#c8323c");R(g,12,bt,12,1,"#e85a64");R(g,20,bt+2,2,4,"#c8323c");R(g,20,bt+5,2,1,"#fff");}
  if(SEASON==="festa_junina"&&phase==="front"){R(g,13,bt,10,1,"#e8b830");[14,17,20].forEach(x=>R(g,x,bt+1,1,1,"#c8323c"));}
  if(SEASON==="carnival"&&phase==="front"){R(g,12,bt,12,1,"#ff6bd5");R(g,12,bt+1,12,1,"#ffd24a");}}
const BATS=[0,1,2,3,4].map(i=>({x:Math.random()*480,y:15+Math.random()*50,v:12+Math.random()*10,ph:i}));
HOOK.sky.push(t=>{if(SEASON==="halloween"){ctx.fillStyle="rgba(60,20,90,.12)";ctx.fillRect(0,0,W,150);BATS.forEach(b=>{b.x=(b.x+b.v*0.016)%500;const x=Math.round(b.x)-10,y=Math.round(b.y+Math.sin(t/300+b.ph)*3),f=Math.floor(t/150+b.ph)%2;R(ctx,x+3,y,3,2,"#1a1020");R(ctx,x,y+(f?-1:1),3,1,"#1a1020");R(ctx,x+6,y+(f?-1:1),3,1,"#1a1020");R(ctx,x+1,y+(f?-2:0),1,1,"#1a1020");R(ctx,x+7,y+(f?-2:0),1,1,"#1a1020");});}
  if(SEASON==="christmas"){ctx.fillStyle="#fff";for(let i=0;i<60;i++){const x=((i*71+t*0.01*(1+i%3))%W),y=((i*37+t*0.02*(1+i%2))%H);ctx.fillRect(x|0,y|0,1,1);}}});
HOOK.ship.push(t=>{if(SEASON==="halloween"){[[300,108],[410,108],[170,108],[118,156],[350,195]].forEach(([x,y],i)=>{disc(ctx,x,y,4,"#f08a24");R(ctx,x-4,y,9,1,"#d0701a");R(ctx,x,y-6,1,2,"#3c7a2a");const lit=Math.floor(t/400+i)%5?"#ffe680":"#ffb347";R(ctx,x-2,y-1,1,1,lit);R(ctx,x+2,y-1,1,1,lit);R(ctx,x-1,y+1,3,1,lit);});
    for(let i=0;i<16;i++){const x=126+i*18,y=94+((i%2)?1:0);ctx.fillStyle=i%2?"#f08a24":"#6a3fa0";ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+8,y);ctx.lineTo(x+4,y+5);ctx.fill();}}
  if(SEASON==="christmas"){for(let i=0;i<14;i++){const x=Math.round(233-i*8.1),y=Math.round(2+i*4)+1;R(ctx,x,y,2,2,["#ff4040","#40ff60","#ffd24a","#40a0ff"][(i+Math.floor(t/500))%4]);}disc(ctx,74,72,5,"#2f7a3a");disc(ctx,74,72,3,"#e9b44c");R(ctx,72,77,5,2,"#c8323c");}
  if(SEASON==="festa_junina"||SEASON==="carnival"){const C=SEASON==="carnival"?["#ff6bd5","#ffd24a","#7fc8ff","#a6f27c"]:["#c8323c","#ffd24a","#2f5f9a","#2f7a3a"];for(let i=0;i<20;i++){const x=Math.round(233-i*5.6),y=Math.round(3+i*2.8);R(ctx,x,y,3,4,C[i%4]);}}});
