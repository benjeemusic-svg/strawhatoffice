/* ================= v4.3 AMBIENT PLAYER (art: pixel-office-art ambient pack v4.2, spec AMBIENT-v4.2.md) =================
   Layers (world px, 402x620): water(+shimmer/foam baked into the 4 cached water canvases) -> sea.under (gull shadows) -> sea.sky (clouds,
   distant ship) -> sea.surface (wake, waterline roll, jumping fish, dolphin, Sea King peek) -> ship(+bob) -> deck (grass, tree rustle, sail)
   -> aquarium (emissive, before the crew so heads in the lounge are never covered) -> crew/flag depth pass -> front -> air (gulls,
   butterflies, leaves). Budget: <=3 ms/frame at 30 fps (V4.ambMs). Paused with the loop when hidden; frozen on a static frame under reduced motion. */
const AMB={on:true,A:V4P.amb||null,img:{},orig:{},cache:{},phase:"day",t0:0,next:{},ev:[],clouds:[],ms:0,calls:0,busy:false,bf:[],leaf:null,gustUntil:0,forced:false};
const AMB_RANGES={gull:[20,40],gullStorm:[60,90],jump:[25,60],dolphin:[60,120],farship:[180,360],cloud:[30,60],seaking:[300,600],leaf:[15,30],leafStorm:[5,10],gust:[8,15]};
function ambRand(a,b){return a+Math.random()*(b-a);}
function ambLoad(){const A=AMB.A;if(!A)return Promise.resolve();
  return Promise.all(Object.values(A.sheets).map(s=>new Promise(ok=>{const i=new Image();i.onload=()=>{AMB.img[s.file]=AMB.orig[s.file]=i;ok();};i.onerror=()=>{console.warn("ambient art failed",s.file);ok();};i.src=V4P.files[s.file];})));}
/* phase: 'lut' sprites use the phase-recoloured sheet (cached), 'none' sprites always use the original sheet */
function ambSetPhase(ph){const A=AMB.A;if(!A)return;AMB.phase=ph;const tbl=V4M.palette.phases[ph];
  Object.values(A.sheets).forEach(s=>{const o=AMB.orig[s.file];if(!o)return;if(ph==="day"||!tbl){AMB.img[s.file]=o;return;}
    const k=ph+s.file;if(!AMB.cache[k])AMB.cache[k]=v4Recolor(o,tbl);AMB.img[s.file]=AMB.cache[k];});}
function ambSheet(e){const f=AMB.A.sheets[e.sheet].file;return e.recolor==="lut"?AMB.img[f]:AMB.orig[f];}
function ambDraw(g,name,k,x,y,flip){const e=AMB.A.sprites[name];if(!e)return;const im=ambSheet(e);if(!im)return;const n=e.frames.length,[sx,sy]=e.frames[((k%n)+n)%n];
  let ax=e.anchor[0],ay=e.anchor[1];x=Math.round(x);y=Math.round(y);AMB.calls++;
  if(!flip){g.drawImage(im,sx,sy,e.w,e.h,x-ax,y-ay,e.w,e.h);return;}
  g.save();g.translate(x-(e.w-1-ax)+e.w,y-ay);g.scale(-1,1);g.drawImage(im,sx,sy,e.w,e.h,0,0,e.w,e.h);g.restore();}
function ambAt(g,name,k,dy){const e=AMB.A.sprites[name];if(!e)return;const [x,y]=e.at;if(e.anchor[0]||e.anchor[1])ambDraw(g,name,k,x,y+dy);else ambDraw(g,name,k,x+e.anchor[0],y+e.anchor[1]+dy);}
const ambTick=(t,fps,n)=>REDUCED?0:Math.floor(t/1000*fps)%n;
/* ---- motion ---- */
function ambBob(t){return (!AMB.A||REDUCED)?0:(((t-AMB.t0)/1000)%4<2?0:1);}
/* ---- sea overlays baked into the procedural water frames (called from v4BuildWater after the 4 frames exist) ---- */
function ambBakeSea(){const A=AMB.A;if(!A||!V4.water||!V4.water.length)return;const ph=V4.phase||"day";
  V4.water.forEach((c,f)=>{const g=c.getContext("2d");g.imageSmoothingEnabled=false;
    for(let y=0;y<V4.EH;y+=64)for(let x=0;x<WW;x+=64){ambDraw(g,"sea_shimmer_"+ph,f,x,y);if(ph==="storm"||ph==="dusk"||f%2===0)ambDraw(g,"sea_foam_"+ph,f,x,y);}});}
/* ---- scheduler (one nextAt per kind; at most 2 one-shot sea events on screen) ---- */
function ambReset(t){AMB.t0=t;const R=AMB_RANGES,n=AMB.next;n.gull=t+ambRand(6,14)*1e3;n.jump=t+ambRand(10,25)*1e3;n.dolphin=t+ambRand(30,60)*1e3;n.farship=t+ambRand(40,90)*1e3;
  n.cloud=t+ambRand(3,10)*1e3;n.seaking=t+Math.max(120,ambRand(...R.seaking)*0.4)*1e3;n.leaf=t+ambRand(...R.leaf)*1e3;n.gust=t+ambRand(...R.gust)*1e3;AMB.ev=AMB.ev.filter(e=>e.kind==="cloud");}
function ambOneShots(){return AMB.ev.filter(e=>e.kind==="jump"||e.kind==="dolphin"||e.kind==="seaking").length;}
function ambSpawn(kind,t){const ph=AMB.phase,R=AMB_RANGES,side=Math.random()<.5;let e=null;
  if(kind==="gull"){const d=side?1:-1;e={kind,t0:t,dur:11000,x0:d>0?-12:WW+12,y0:ambRand(20-V4.oy,600+V4.oy),d,n:Math.random()<.3?2:1};}
  else if(kind==="jump"){const m=Math.random();e=m<.35?{kind,t0:t,x:ambRand(18,380),y:ambRand(604,616)}:{kind,t0:t,x:side?ambRand(14,40):ambRand(362,388),y:ambRand(150,560)};}
  else if(kind==="dolphin"){e={kind,t0:t,x:side?26:376,y:ambRand(170,540),flip:!side};if(Math.random()<.3)AMB.ev.push(Object.assign({},e,{t0:t+400,y:e.y+14}));}
  else if(kind==="farship"){e={kind,t0:t,dur:ambRand(120,180)*1e3,y:Math.random()<.6?ambRand(10,30)-Math.floor(V4.oy*.6):ambRand(602,612)+Math.floor(V4.oy*.6),d:side?1:-1};}
  else if(kind==="cloud"){const s=Math.floor(Math.random()*3);e={kind,t0:t,s,x:-60,y:ambRand(-V4.oy,600+V4.oy),v:ph==="storm"?8:ambRand(3,6)};}
  else if(kind==="seaking"){e={kind,t0:t,x:side?ambRand(24,38):ambRand(364,378),y:ambRand(160,560)};}
  if(e)AMB.ev.push(e);}
function ambSchedule(t){if(REDUCED||!AMB.A)return;const ph=AMB.phase,n=AMB.next,R=AMB_RANGES;
  if(t>=n.gull){if(ph!=="night")ambSpawn("gull",t);n.gull=t+ambRand(...(ph==="storm"?R.gullStorm:R.gull))*1e3;}
  if(t>=n.jump){if(ph!=="storm"&&ambOneShots()<2)ambSpawn("jump",t);n.jump=t+ambRand(...R.jump)*1e3;}
  if(t>=n.dolphin){if((ph==="day"||ph==="dusk")&&ambOneShots()<2)ambSpawn("dolphin",t);n.dolphin=t+ambRand(...R.dolphin)*1e3;}
  if(t>=n.farship){if(!AMB.ev.some(e=>e.kind==="farship"))ambSpawn("farship",t);n.farship=t+ambRand(...R.farship)*1e3;}
  if(t>=n.cloud){const max=ph==="storm"?4:3;if(AMB.ev.filter(e=>e.kind==="cloud").length<max)ambSpawn("cloud",t);n.cloud=t+ambRand(...R.cloud)*1e3*(ph==="storm"?.5:1);}
  if(t>=n.seaking){if(ambOneShots()<2&&!AMB.ev.some(e=>e.kind==="dolphin")){ambSpawn("seaking",t);n.seaking=t+ambRand(...R.seaking)*1e3;}else n.seaking=t+5000;}
  if(t>=n.leaf){if(ph!=="night"&&!AMB.leaf){const tr=AMB.A.placements.deck.trees[Math.floor(Math.random()*4)];AMB.leaf={t0:t,x:tr.canopy[0]+ambRand(-tr.r*.6,tr.r*.6),y:tr.canopy[1]+tr.r*.5,v:Math.random()<.5?"leaf_green":"leaf_autumn"};}
    n.leaf=t+ambRand(...(ph==="storm"?R.leafStorm:R.leaf))*1e3;}
  if(t>=n.gust){AMB.gustUntil=t+2000;n.gust=t+ambRand(...R.gust)*1e3;}
  AMB.ev=AMB.ev.filter(e=>{const age=t-e.t0;if(e.kind==="gull")return age<e.dur;if(e.kind==="farship")return age<e.dur;if(e.kind==="cloud")return e.x+(age/1000)*e.v<WW+70;
    const nm={jump:"jump_fish",dolphin:"dolphin",seaking:"seaking_peek"}[e.kind];return age<ambLen(nm)*1000/AMB.A.sprites[nm].fps+200;});
  if(AMB.leaf&&t-AMB.leaf.t0>6500)AMB.leaf=null;}
function ambLen(nm){const e=AMB.A.sprites[nm],h=e.hold||{};return e.frames.length+Object.values(h).reduce((a,b)=>a+b,0);}
function ambShot(nm,age){const e=AMB.A.sprites[nm],h=e.hold||{},i=Math.floor(age/1000*e.fps);if(i<0)return -1;let k=0,c=0;for(;k<e.frames.length;k++){c+=1+(h[k]||0);if(i<c)return k;}return -1;}
/* ---- layers ---- */
function ambSea(g,t){if(!AMB.A)return;const ph=AMB.phase;
  // sea.under: gull shadows
  AMB.ev.forEach(e=>{if(e.kind!=="gull"||t<e.t0)return;const s=(t-e.t0)/1000;for(let j=0;j<e.n;j++){const x=e.x0+e.d*40*s-e.d*j*14,y=e.y0+6*Math.sin(s*1.3)+j*9;ambDraw(g,"gull_shadow",0,x+10,y+22);}});
  // sea.sky: clouds + distant ship
  AMB.ev.forEach(e=>{const s=(t-e.t0)/1000;if(e.kind==="cloud")ambDraw(g,"cloud"+e.s+"_"+ph,0,e.x+s*e.v,e.y);
    else if(e.kind==="farship"){const p=(t-e.t0)/e.dur,x=e.d>0?-20+p*(WW+40):WW+20-p*(WW+40);ambDraw(g,"far_ship",ambTick(t,1,2),x,e.y,e.d>0);}});
  // sea.surface
  ambDraw(g,"wake",ambTick(t,6,4),201,598);
  if(!REDUCED){const R=AMB.A.motion.roll,st=R.steps[Math.floor((((t-AMB.t0)/1000)%R.period_s)/R.step_s)];if(st&&st[0])ambAt(g,"waterline_"+st[0],st[1],0);}
  AMB.ev.forEach(e=>{if(t<e.t0)return;const nm={jump:"jump_fish",dolphin:"dolphin",seaking:"seaking_peek"}[e.kind];if(!nm)return;const k=ambShot(nm,t-e.t0);if(k>=0)ambDraw(g,nm,k,e.x,e.y,!!e.flip);});}
function ambDeck(g,t,dy){if(!AMB.A)return;const P=AMB.A.placements.deck,gust=!REDUCED&&t<AMB.gustUntil,gk=REDUCED?0:Math.floor(t/1000*(gust?6:3));
  P.grass.forEach(([x,y,v])=>ambDraw(g,"grass_"+v,REDUCED?0:(gk+(x>>4))%4,x,y+dy));
  if(gust){const k=[0,1,2,1][Math.floor(t/1000*6)%4];for(let i=0;i<4;i++)ambAt(g,"tree"+i+"_rustle",k,dy);}
  ambDraw(g,"sail",ambTick(t,AMB.phase==="storm"?8:5,6),201,113+dy);}
function ambAquarium(g,t,dy){if(!AMB.A)return;const T=AMB.A.placements.aquarium.tanks,s=REDUCED?0:t/1000,kinds=[[["clown",7,4,0],["tang",5,9,30]],[["pink",9,6,10],["puff",4,11,50]]];
  T.forEach((tk,i)=>{ambAt(g,tk.id+"_bg",0,dy);g.save();g.beginPath();g.rect(tk.x,tk.y+dy,tk.w,20);g.clip();
    kinds[i].forEach(([kind,v,lane,ph],j)=>{const L=tk.swim.w-12,p=(v*s+ph)%(2*L),right=p>=L,x=tk.x+8+(right?p-L:L-p),y=tk.y+2+lane+Math.round(Math.sin(s*1.7+j));
      ambDraw(g,"aq_"+kind,ambTick(t,6,4),x,y+dy,right);});
    if(!REDUCED)tk.bubblers.forEach(([bx,by],b)=>ambDraw(g,"aq_bubble_column",Math.floor((t/1000+b*.7)*6)%8,bx,by+dy));
    g.restore();});}
function ambFlag(t){return AMB.A?{y:AMB.A.sprites.flag.at[1],draw:(g,dy)=>{const [x,y]=AMB.A.sprites.flag.at;ambDraw(g,"flag",ambTick(t,{night:5,storm:12}[AMB.phase]||8,6),x,y+dy);}}:null;}
/* ambAir(g,t,"ground"): resting butterflies + a landed leaf, drawn inside the y-sorted pass BEFORE the crew (feet are never covered);
   ambAir(g,t): flying butterflies, the falling leaf and gulls, drawn over everything (they are in the air) */
function ambAir(g,t,layer){if(!AMB.A)return;const ph=AMB.phase,s=(t-AMB.t0)/1000,gr=layer==="ground";
  if(!REDUCED&&(ph==="day"||ph==="dusk"))["butterfly_orange","butterfly_pink"].forEach((nm,j)=>{if(ph==="dusk"&&j)return;const q=s+j*37,rest=(q%14)>11,
    x=rest?0:200+90*Math.sin(q*.35+j*2.4)+12*Math.sin(q*1.9+j),y=rest?0:92+30*Math.sin(q*.5+j*1.3)*Math.cos(q*.21+j);
    if(!rest){if(!gr)ambDraw(g,nm,Math.floor(t/100)%4,x,y);}else if(gr){const sp=AMB.A.placements.deck.grass[j*3%AMB.A.placements.deck.grass.length];ambDraw(g,nm,2,sp[0]+8,sp[1]+8);}});
  const L=AMB.leaf;if(L&&!REDUCED){const a=(t-L.t0)/1000,fall=Math.min(a*6,20);if((fall>=20)===gr)ambDraw(g,L.v,fall<20?Math.floor(a*6)%4:0,L.x+(fall<20?3*Math.sin(a*2.2):0),L.y+fall);}
  if(gr)return;
  AMB.ev.forEach(e=>{if(e.kind!=="gull"||t<e.t0)return;const q=(t-e.t0)/1000;for(let j=0;j<e.n;j++){const x=e.x0+e.d*40*q-e.d*j*14,y=e.y0+6*Math.sin(q*1.3)+j*9,flap=((q+j*.4)%3)<1.2;
    ambDraw(g,"gull",flap?Math.floor(q*8)%4:1,x,y,e.d<0);}});}
/* redraw key + busy (30 fps only while something moves smoothly: gulls; everything else steps at <=10 fps) */
function ambKey(t){if(!AMB.A||REDUCED)return "";AMB.busy=AMB.ev.some(e=>e.kind==="gull");return "|a"+Math.floor(t/100)+(AMB.busy?"."+Math.floor(t/33):"");}
/* lifecycle */
document.addEventListener("visibilitychange",()=>{if(!document.hidden)ambReset(performance.now());});
if(RM_Q.addEventListener)RM_Q.addEventListener("change",()=>{ambReset(performance.now());V4.lastKey="";});
AMB.load=ambLoad().then(()=>{ambReset(performance.now());});
