/* ================= REWARDS: wanted posters, ship upgrades, achievements, trophy shelf, MVP ================= */
const deliveries=(id,sinceMs)=>allHistory().filter(h=>h.crew===id&&(!sinceMs||new Date(h.at).getTime()>=sinceMs));
function weekStart(){const n=spNow();const d=new Date(Date.UTC(n.y,n.m-1,n.d));const wd=(d.getUTCDay()+6)%7;return Date.UTC(n.y,n.m-1,n.d-wd)+3*3600*1000;} // Monday 00:00 BRT
function weekKey(){return new Date(weekStart()).toISOString().slice(0,10);}
function weeklyMVP(){const since=weekStart();let best=null;agents.forEach(a=>{const n=deliveries(a.id,since).length;if(n>0&&(!best||n>best.n))best={a,n};});return best;}
function currentMVP(){const m=LS.get("mvp",null);return m&&m.week===weekKey()?m:null;}
const shipStage=s=>shipOrders().filter(o=>o.stage===s);
const palletShipped=()=>shipOrders().some(o=>o.stage==="us"||/ship(ped)? to (the )?us|at sea|sailed/i.test(o.status||""));
const ACH=[
  {id:"first",l:"First loot",f:s=>s.items>=1},
  {id:"i250",l:"250 items",f:s=>s.items>=250},{id:"i500",l:"500 items",f:s=>s.items>=500},{id:"i1000",l:"1,000 items",f:s=>s.items>=1000},
  {id:"o25",l:"25 orders",f:s=>s.orders>=25},{id:"o50",l:"50 orders",f:s=>s.orders>=50},
  {id:"s100",l:"R$100k spend",f:s=>s.spend>=100000},{id:"s250",l:"R$250k spend",f:s=>s.spend>=250000},
  {id:"c10",l:"First R$10k commission",f:s=>s.commission>=10000},{id:"c25",l:"R$25k commission",f:s=>s.commission>=25000},
  {id:"pallet",l:"Pallet shipped",f:()=>palletShipped()},
  {id:"deals10",l:"10 deals under average",f:()=>allHistory().filter(h=>h.type==="deal_found").length>=10},
  {id:"job1",l:"First job done",f:()=>allJobs().some(j=>/done|complete/i.test(j.status||""))},
  {id:"mvp",l:"First weekly MVP",f:()=>!!LS.get("mvpEver",null)},
];
const memo=(fn,ms=2000)=>{let v,ts=-1e9;return(...a)=>{const n=performance.now();if(n-ts>ms||a.length){v=fn(...a);ts=n;}return v;};};
const achState=memo(function(){const s=stats||{};return ACH.map(x=>{let on=false;try{on=!!(stats&&x.f(s));}catch(e){}return Object.assign({},x,{on});});});
function renderAchievements(){const a=$("ach");if(!a)return;a.innerHTML="";const got=LS.get("achGot",{}),init=LS.get("achInit",false);
  achState(true).forEach(x=>{const e=document.createElement("span");e.textContent=(x.on?"🏆 ":"☆ ")+x.l;if(x.on){e.className="on";if(!got[x.id]){got[x.id]=new Date().toISOString();if(init)addLog("System","Achievement unlocked: "+x.l);}}a.appendChild(e);});
  LS.set("achGot",got);LS.set("achInit",true);}
/* ship upgrades unlocked by real milestones */
const UPG=[
  {id:"lanterns",l:"Brass lanterns",need:"R$100k total spend",f:s=>s.spend>=100000,p:s=>s.spend/100000},
  {id:"pennants",l:"Victory pennants on the rigging",need:"25 orders",f:s=>s.orders>=25,p:s=>s.orders/25},
  {id:"sail",l:"Gold-trimmed sail",need:"R$15k commission",f:s=>s.commission>=15000,p:s=>s.commission/15000},
  {id:"lion",l:"Golden crown on the lion",need:"500 items tracked",f:s=>s.items>=500,p:s=>s.items/500},
  {id:"room",l:"New room: observation deck",need:"first pallet shipped (SHIPPING tab)",f:()=>palletShipped(),p:()=>palletShipped()?1:0},
];
const _upg=memo(()=>Object.fromEntries(UPG.map(u=>{try{return [u.id,!!(stats&&u.f(stats))];}catch(e){return [u.id,false];}})));
const upgOn=id=>_upg()[id];
const upgOn_=id=>{const u=UPG.find(x=>x.id===id);try{return !!(stats&&u.f(stats));}catch(e){return false;}};
function openUpgrades(){const b=el("div");b.append(el("div",{class:"note"},"Unlocked automatically from real tracker numbers; the visuals appear on the ship."));
  UPG.forEach(u=>{const on=upgOn(u.id),p=stats?Math.min(1,u.p(stats)):0;b.append(el("div",{class:"upg"},el("span",{class:"ic "+(on?"on":"off")},on?"UNLOCKED":Math.floor(p*100)+"%"),el("div",{},el("b",{},u.l),el("div",{class:"note"},"Requires "+u.need))));});
  b.append(el("h4",{style:"font-family:PS2P;font-size:9px;color:#7a2e1a;margin:12px 0 4px"},"ACHIEVEMENTS / TROPHY SHELF"));
  achState().forEach(x=>b.append(el("div",{class:"upg"},el("span",{class:"ic "+(x.on?"on":"off")},x.on?"TROPHY":"LOCKED"),el("span",{},x.l))));
  openModal("SHIP UPGRADES",b);}
HOOK.ship.push(t=>{ if(!stats)return;
  if(upgOn("lanterns"))[[104,130],[200,130],[318,130],[160,174],[320,174],[116,77]].forEach(([x,y])=>disc(ctx,x,y,24,"rgba(255,215,120,.05)"));
  if(upgOn("pennants")){const C=["#c8323c","#ffd24a","#2f7a3a","#2f5f9a","#fff"];for(let i=0;i<10;i++){const x=250+i*16,y=Math.round(3+(x-233)*0.576)+Math.round(Math.sin(t/400+i));ctx.fillStyle=C[i%5];ctx.beginPath();ctx.moveTo(x-3,y);ctx.lineTo(x+4,y);ctx.lineTo(x,y+6);ctx.fill();}}
  if(upgOn("sail")){R(ctx,176,27,115,2,"#e8b830");R(ctx,176,92,115,2,"#e8b830");}
  if(upgOn("lion")){R(ctx,437,60,15,4,"#e8b830");[437,443,449].forEach(x=>R(ctx,x,56,3,4,"#ffd24a"));R(ctx,443,61,3,2,"#c8323c");}
  if(upgOn("room")){R(ctx,58,46,48,11,"#cfe8ff");R(ctx,58,45,48,1,OUTL);R(ctx,57,45,1,12,OUTL);R(ctx,106,45,1,12,OUTL);[70,82,94].forEach(x=>R(ctx,x,46,1,11,"#8aa6c0"));R(ctx,60,47,6,2,"#fff");}
  // trophy shelf on the ledger-room wall (one gold cup per unlocked achievement)
  const A=achState();[0,1].forEach(r=>{const y=176+r*9;R(ctx,307,y+4,32,2,"#8a5527");R(ctx,307,y+6,32,1,OUTL);
    A.slice(r*7,r*7+7).forEach((x,i)=>{const cx=308+i*4.4|0;if(x.on){R(ctx,cx,y,3,2,"#ffd24a");R(ctx,cx+1,y+2,1,1,"#c99a1e");R(ctx,cx,y+3,3,1,"#c99a1e");R(ctx,cx,y,1,1,"#fff6c8");}else R(ctx,cx+1,y+1,1,3,"rgba(60,40,20,.35)");});});
  // MVP crown above the weekly MVP
  const m=currentMVP();if(m){const a=agents.find(x=>x.id===m.crew);if(a){const L=LOOKS[a.id],y=Math.round(a.y-(L.tall?33:L.short?27:30));R(ctx,a.x-3,y+2,7,2,"#ffd24a");[a.x-3,a.x,a.x+3].forEach(x=>R(ctx,x,y,1,2,"#ffd24a"));R(ctx,a.x,y+2,1,1,"#c8323c");}}
});
/* wanted posters with bounty from real event counts */
function openWanted(){const g=el("div",{class:"posters"});const m=currentMVP();
  agents.forEach(a=>{const h=deliveries(a.id),n=h.length,wk=deliveries(a.id,weekStart()).length;const c=el("canvas",{width:22,height:30});portrait(c,a.id);
    const last=h.length?h.slice().sort((x,y)=>new Date(y.at)-new Date(x.at))[0]:null;
    g.append(el("div",{class:"poster-card"},el("div",{class:"w"},"WANTED"),c,el("b",{},a.name.toUpperCase()+(m&&m.crew===a.id?" 👑":"")),el("div",{class:"note"},a.role),
      el("div",{class:"b"},"฿ "+(n*CONFIG.bountyPerDelivery).toLocaleString("en-US")),el("div",{class:"note"},`${n} real deliveries (${wk} this week)`),el("div",{class:"note"},last?(EVENTS[last.type]?EVENTS[last.type].label:last.type)+" · "+fmtTime(last.at,true):"no deliveries logged yet")));});
  const b=el("div");b.append(el("div",{class:"note"},`Bounty = real delivered events × ฿${CONFIG.bountyPerDelivery.toLocaleString("en-US")} (fun currency). Counted from CREW STATUS events seen by this browser plus status.json "eventHistory". Previews never count.`),g);
  openModal("WANTED POSTERS",b);}
