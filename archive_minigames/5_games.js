/* ================= MINI-GAMES (modal): fishing, treasure diving, cannon practice, card packs, tracker quiz ================= */
const GAMES=[["fish","FISHING"],["dive","TREASURE DIVING"],["cannon","USOPP'S CANNON"],["packs","CARD PACKS"],["quiz","BREAK-ROOM QUIZ"]];
let gameStop=null;
function openGames(tab){const box=el("div"),tabs=el("div",{class:"tabs"}),area=el("div");box.append(tabs,area);
  const show=k=>{if(gameStop){gameStop();gameStop=null;}tabs.querySelectorAll("button").forEach(b=>b.classList.toggle("on",b.dataset.k===k));area.innerHTML="";gameStop=({fish:gFish,dive:gDive,cannon:gCannon,packs:gPacks,quiz:gQuiz})[k](area)||null;};
  GAMES.forEach(([k,l])=>tabs.append(el("button",{class:"btn","data-k":k,onclick:()=>show(k)},l)));
  openModal("MINI-GAMES",box);modalCleanup=()=>{if(gameStop){gameStop();gameStop=null;}};show(tab||"fish");}
const best=(k,v)=>{const b=LS.get("best."+k,0);if(v!=null&&v>b){LS.set("best."+k,v);return v;}return b;};
function gameCanvas(area,w=320,h=180){const c=el("canvas",{width:w,height:h,class:"gamecv"});area.append(c);const g=c.getContext("2d");g.imageSmoothingEnabled=false;const pos=ev=>{const r=c.getBoundingClientRect();return [(ev.clientX-r.left)*w/r.width,(ev.clientY-r.top)*h/r.height];};return {c,g,pos,w,h};}
function txt(g,s,x,y,col="#fff",size=8,align="left"){g.font=size+"px PS2P";g.textAlign=align;g.fillStyle="#000";g.fillText(s,x+1,y+1);g.fillStyle=col;g.fillText(s,x,y);g.textAlign="left";}
function loopFn(fn){let raf=0,last=performance.now();const L=t=>{const dt=Math.min(50,t-last);last=t;fn(t,dt);raf=requestAnimationFrame(L);};raf=requestAnimationFrame(L);return ()=>cancelAnimationFrame(raf);}
/* --- fishing: wait for the bite, click fast --- */
const FISH=[["Sardine",1,60],["Tangerine Fish",2,25],["Golden Carp",5,10],["Sea King Fry",15,4],["Legendary Fat Tuna",40,1]];
function gFish(area){const {c,g,w,h}=gameCanvas(area);area.append(el("div",{class:"note"},"Click to cast. When the bobber shakes and '!' appears, click fast!"));
  let st="idle",t0=0,bite=0,msg="Click to cast",caught=LS.get("fishLog",{}),score=LS.get("fishScore",0);
  c.onclick=()=>{const n=performance.now();if(st==="idle"||st==="done"){st="wait";t0=n;bite=n+2000+Math.random()*4500;msg="Waiting for a bite…";beep(500,.04);}
    else if(st==="wait"){st="done";msg="Too early! The fish got away.";beep(200,.1);}
    else if(st==="bite"){if(n-bite<900){let r=Math.random()*100,f=FISH[0];for(const x of FISH){if(r<x[2]){f=x;break;}r-=x[2];}caught[f[0]]=(caught[f[0]]||0)+1;score+=f[1];LS.set("fishLog",caught);LS.set("fishScore",score);msg=`Caught: ${f[0]}! (+${f[1]})`;[660,880,1100].forEach((q,i)=>setTimeout(()=>beep(q,.06),i*80));}else msg="Too slow! It got away.";st="done";}};
  return loopFn(t=>{const n=performance.now();if(st==="wait"&&n>bite)st="bite";if(st==="bite"&&n-bite>900){st="done";msg="Too slow! It got away.";}
    for(let y=0;y<h;y+=2)R(g,0,y,w,2,y<70?lerpC("#7fc8ff","#cfeaff",y/70):lerpC("#3a8fd0","#0f4f8e",(y-70)/110));R(g,0,70,w,1,"#e8f6ff");
    R(g,0,62,90,14,"#c8762a");R(g,0,62,90,2,"#ffd27a");g.drawImage(mk(36,48,q=>drawChibi(q,"usopp",18,44,t,false,"right")),40,18);
    line(g,62,40,110,10,"#5c3416");const bx=200,by=74+(st==="bite"?Math.round(Math.sin(t/40)*2):Math.round(Math.sin(t/500)));
    if(st!=="idle"){line(g,110,10,bx,by,"rgba(255,255,255,.7)");R(g,bx-2,by-3,5,3,"#e0424f");R(g,bx-2,by,5,3,"#fff");}
    if(st==="bite")txt(g,"!",bx-3,by-8,"#ffd24a",12);
    txt(g,msg,8,170,"#fff",7);txt(g,"Score "+score,w-8,14,"#ffd24a",7,"right");
    Object.entries(caught).slice(0,5).forEach(([k,v],i)=>txt(g,`${k} ×${v}`,w-8,30+i*11,"#fff",5,"right"));});}
/* --- treasure diving: steer the diver, grab coins, dodge jellyfish (30 s) --- */
function gDive(area){const {c,g,pos,w,h}=gameCanvas(area);area.append(el("div",{class:"note"},"Move the mouse to steer. Grab coins, avoid jellyfish. 30 seconds. Click to start."));
  let run=false,end=0,score=0,mx=w/2,my=h/2,dv={x:w/2,y:40},items=[],msg="Click to dive!",air=1;
  c.onmousemove=ev=>{[mx,my]=pos(ev);};c.onclick=()=>{if(!run){run=true;end=performance.now()+30000;score=0;items=[];dv={x:w/2,y:40};air=1;}};
  return loopFn((t,dt)=>{const n=performance.now();for(let y=0;y<h;y+=2)R(g,0,y,w,2,lerpC("#1f7fc0","#06243f",y/h));
    for(let i=0;i<5;i++)R(g,(i*70+t/40)%w|0,0,30,h,"rgba(255,255,255,.03)");for(let x=0;x<w;x+=6)R(g,x,h-8-((x*7)%5),6,8+((x*7)%5),"#c9a26b");
    if(run){dv.x+=(mx-dv.x)*dt/250;dv.y+=(my-dv.y)*dt/250;if(Math.random()<dt/450)items.push({x:w+5,y:20+Math.random()*(h-40),k:Math.random()<.72?"coin":"jelly",v:20+Math.random()*30});
      items.forEach(it=>{it.x-=it.v*dt/1000;if(Math.hypot(it.x-dv.x,it.y-dv.y)<9&&!it.hit){it.hit=true;if(it.k==="coin"){score+=10;beep(990,.04);}else{score=Math.max(0,score-15);beep(150,.1);}}});items=items.filter(it=>it.x>-10&&!it.hit);
      if(n>end){run=false;msg=`Time! Score ${score}. Best ${best("dive",score)}`;}}
    items.forEach(it=>{if(it.k==="coin"){disc(g,it.x|0,it.y|0,3,"#ffd24a");R(g,(it.x|0)-1,(it.y|0)-1,1,2,"#fff6c8");}else{disc(g,it.x|0,it.y|0,4,"#ff9ef0");for(let k=-3;k<=3;k+=2)R(g,(it.x|0)+k,(it.y|0)+3,1,4+Math.round(Math.sin(t/200+k)),"#ff9ef0");}});
    const x=dv.x|0,y=dv.y|0;R(g,x-6,y-3,12,6,"#e0602a");disc(g,x+6,y,4,"#d4a23a");disc(g,x+6,y,2,"#7fc8ff");R(g,x-10,y-1+Math.round(Math.sin(t/120)*2),4,2,"#2a2a2a");
    if(Math.floor(t/400)%2)R(g,x+8,y-8-(t/50%8|0),2,2,"rgba(255,255,255,.6)");
    txt(g,run?`Score ${score}  ${Math.ceil((end-n)/1000)}s`:msg,8,14,"#fff",7);txt(g,"Best "+best("dive"),w-8,14,"#ffd24a",7,"right");});}
/* --- Usopp's cannon: aim with the mouse, hold to charge, release to fire (10 shots) --- */
function gCannon(area){const {c,g,pos,w,h}=gameCanvas(area);area.append(el("div",{class:"note"},"Aim with the mouse, hold the button to charge and release to fire. 10 shots."));
  let mx=200,my=60,charge=0,holding=false,shots=10,score=0,balls=[],targets=[],msg="";const spawn=()=>({x:170+Math.random()*130,y:70+Math.random()*80,ph:Math.random()*6,hit:0});
  for(let i=0;i<3;i++)targets.push(spawn());
  c.onmousemove=ev=>{[mx,my]=pos(ev);};c.onmousedown=()=>{if(shots>0)holding=true;else{shots=10;score=0;msg="";}};
  c.onmouseup=()=>{if(!holding)return;holding=false;const an=Math.atan2(my-150,mx-30),v=90+charge*170;balls.push({x:30,y:150,vx:Math.cos(an)*v,vy:Math.sin(an)*v});shots--;charge=0;beep(120,.12,"sawtooth");};
  return loopFn((t,dt)=>{if(holding)charge=Math.min(1,charge+dt/900);for(let y=0;y<h;y+=2)R(g,0,y,w,2,y<110?lerpC("#7fc8ff","#cfeaff",y/110):lerpC("#3a8fd0","#0f4f8e",(y-110)/70));
    targets.forEach(T=>{const ty=T.y+Math.sin(t/600+T.ph)*6;T.cy=ty;if(T.hit&&t-T.hit<400){disc(g,T.x|0,ty|0,9,"#ffd24a");}else{disc(g,T.x|0,ty|0,8,"#fff");disc(g,T.x|0,ty|0,6,"#c8323c");disc(g,T.x|0,ty|0,4,"#fff");disc(g,T.x|0,ty|0,2,"#c8323c");}});
    balls.forEach(b=>{b.vy+=140*dt/1000;b.x+=b.vx*dt/1000;b.y+=b.vy*dt/1000;targets.forEach((T,i)=>{if(!b.done&&Math.hypot(b.x-T.x,b.y-T.cy)<9){b.done=true;score+=Math.hypot(b.x-T.x,b.y-T.cy)<4?3:1;T.hit=t;setTimeout(()=>targets[i]=spawn(),400);beep(880,.06);}});disc(g,b.x|0,b.y|0,2,"#222");});
    balls=balls.filter(b=>!b.done&&b.y<h+10&&b.x<w+10);
    const an=Math.atan2(my-150,mx-30);R(g,14,150,28,12,"#7a4a22");for(let i=0;i<16;i++)R(g,Math.round(30+Math.cos(an)*i)-2,Math.round(150+Math.sin(an)*i)-2,5,5,"#3a3a44");disc(g,22,162,5,"#5c3416");
    g.drawImage(mk(36,48,q=>drawChibi(q,"usopp",18,44,t,false,"right")),-8,118);
    R(g,8,172,60,4,"#2a160a");R(g,9,173,58*charge|0,2,"#ffd24a");
    if(shots<=0&&!balls.length&&!msg){msg=`Done! Score ${score}. Best ${best("cannon",score)}. Click to play again.`;}
    txt(g,msg||`Shots ${shots}  Score ${score}`,8,14,"#fff",7);if(!msg)txt(g,"Best "+best("cannon"),w-8,14,"#ffd24a",7,"right");});}
/* --- virtual card packs: one pack per real new purchase (original art) --- */
const CARDS=[...["luffy","zoro","nami","usopp","sanji","chopper","robin","brook","jinbe"].map((id,i)=>({id,name:null,r:id==="luffy"?"epic":i<5?"rare":"common",crew:true})),
  {id:"lion",name:"Sunflower Lion",r:"rare"},{id:"tangerine",name:"Tangerine Grove",r:"common"},{id:"snail",name:"Den Den Mushi",r:"common"},{id:"chest",name:"Treasure Chest",r:"common"},{id:"seaking",name:"Sea King",r:"epic"},{id:"tag",name:"Deal Tag",r:"common"},{id:"scope",name:"Release Spyglass",r:"common"},{id:"ledger",name:"Crew Ledger",r:"common"},{id:"pallet",name:"Golden Pallet",r:"legendary"}];
function cardArt(cv,cd){const g=cv.getContext("2d");g.imageSmoothingEnabled=false;R(g,0,0,36,36,{common:"#e9d3a0",rare:"#bfe3ff",epic:"#e0c8ff",legendary:"#ffe680"}[cd.r]);
  if(cd.crew){g.drawImage(mk(36,48,q=>drawChibi(q,cd.id,18,44,500,false,"down")),0,-10);return;}
  const C=18;({lion:()=>{for(let a=0;a<12;a++){const an=a/12*Math.PI*2;disc(g,C+Math.cos(an)*11|0,C+Math.sin(an)*11|0,3,a%2?"#f5961e":"#ffc83a");}disc(g,C,C,8,"#ffe39a");R(g,C-4,C-2,2,2,OUTL);R(g,C+3,C-2,2,2,OUTL);R(g,C-2,C+3,5,1,"#8a4a2a");},
    tangerine:()=>{disc(g,C,C+2,9,"#f5961e");disc(g,C-3,C-1,3,"#ffc060");R(g,C,C-9,2,3,"#3c7a2a");R(g,C+2,C-9,4,2,"#57c26a");},
    snail:()=>{R(g,6,24,24,5,"#d9a77a");disc(g,15,18,7,"#3fa9f5");disc(g,15,18,3,"#1f5f9a");R(g,26,14,3,11,"#d9a77a");R(g,6,9,16,2,"#2a2a2a");},
    chest:()=>{R(g,6,14,24,14,"#8a5527");R(g,6,14,24,4,"#c08a4e");R(g,16,18,4,5,"#d4a23a");R(g,8,10,20,4,"#ffd24a");},
    seaking:()=>{disc(g,C,C+4,10,"#6a3fa0");disc(g,C-2,C+1,6,"#8e62c8");R(g,C+3,C-1,3,3,"#ffd24a");R(g,C-5,C+8,10,2,"#fff");R(g,C-4,C-9,3,5,"#e0424f");},
    tag:()=>{R(g,8,12,20,12,"#ffd24a");R(g,8,12,20,1,OUTL);disc(g,11,18,2,"#fff");g.font="7px PS2P";g.fillStyle="#c8323c";g.fillText("%",16,22);},
    scope:()=>{for(let i=0;i<18;i++)R(g,8+i,26-i,4,4,i<6?"#5c3416":"#d4a23a");disc(g,27,8,3,"#7fc8ff");},
    ledger:()=>{R(g,8,6,20,26,"#3c6b3c");R(g,10,8,16,22,"#f3ecd6");for(let i=0;i<5;i++)R(g,12,11+i*4,12,1,"#8b8070");},
    pallet:()=>{R(g,4,26,28,4,"#c99a1e");for(let r=0;r<2;r++)for(let k=0;k<3;k++){R(g,6+k*9,10+r*8,8,7,"#ffd24a");R(g,6+k*9,10+r*8,8,1,"#fff6c8");}}})[cd.id]();}
const cardName=cd=>cd.name||(agents.find(a=>a.id===cd.id)||{}).name||cd.id;
function packsInfo(){const o=stats?stats.orders:0;let base=LS.get("packs.base",null);if(base==null&&stats){base=o;LS.set("packs.base",base);}const earned=1+Math.max(0,o-(base||0)),opened=LS.get("packs.opened",0);return {earned,opened,left:Math.max(0,earned-opened),orders:o};}
function drawCard(){const r=Math.random()*100,rar=r<1?"legendary":r<9?"epic":r<35?"rare":"common";const pool=CARDS.filter(c=>c.r===rar);return pool[Math.floor(Math.random()*pool.length)];}
function gPacks(area){const render=()=>{area.innerHTML="";const P=packsInfo(),coll=LS.get("cards",{});
  area.append(el("div",{class:"note"},`One pack per real new purchase in the tracker (orders counted since this browser first opened the office: ${P.orders-(LS.get("packs.base",P.orders))} new) + 1 welcome pack. Packs left: ${P.left}. Original art; these are not real TCG cards.`));
  const res=el("div",{class:"cardgrid",style:"min-height:150px;margin:8px 0"});
  const btn=el("button",{class:"btn green",onclick:()=>{if(packsInfo().left<=0)return;LS.set("packs.opened",LS.get("packs.opened",0)+1);const got=[0,1,2,3,4].map(drawCard);const c2=LS.get("cards",{});got.forEach(cd=>c2[cd.id]=(c2[cd.id]||0)+1);LS.set("cards",c2);
    res.innerHTML="";got.forEach((cd,i)=>{const d=el("div",{class:"tcard back"});res.append(d);setTimeout(()=>{d.className="tcard "+cd.r;const cv=el("canvas",{width:36,height:36});cardArt(cv,cd);d.append(cv,el("div",{},cardName(cd)),el("div",{class:"r"},cd.r.toUpperCase()));beep(cd.r==="legendary"?1320:cd.r==="epic"?1100:700,.06);},400+i*450);});
    if(got.some(c=>c.r==="legendary"))addLog("System","Pulled a LEGENDARY Golden Pallet card!");setTimeout(()=>{btn.disabled=packsInfo().left<=0;btn.textContent="OPEN PACK ("+packsInfo().left+" left)";upd();},2800);}},"OPEN PACK ("+P.left+" left)");btn.disabled=P.left<=0;
  const colBox=el("div");const upd=()=>{const cc=LS.get("cards",{});colBox.innerHTML="";colBox.append(el("div",{class:"note",style:"margin-top:6px"},`Collection: ${Object.keys(cc).length}/${CARDS.length} unique`),el("div",{style:"font-size:15px"},CARDS.map(cd=>(cc[cd.id]?"★ ":"☆ ")+cardName(cd)+(cc[cd.id]>1?" ×"+cc[cd.id]:"")).join(" · ")));};upd();
  area.append(btn,res,colBox);};render();return null;}
/* --- break-room quiz built from real tracker numbers --- */
function quizQs(){const s=stats;if(!s)return [];const Q=[],fmtN=n=>n.toLocaleString("en-US");
  const near=(v,f)=>{const set=new Set([f(v)]);let k=0;while(set.size<4&&k++<40){const m=[.6,.75,.85,1.15,1.3,1.5][Math.floor(Math.random()*6)];set.add(f(Math.round(v*m)));}return [...set].sort(()=>Math.random()-.5);};
  Q.push({q:"How many items are in the tracker?",a:fmtN(s.items),o:near(s.items,fmtN)});
  Q.push({q:"Total spend so far (BRL)?",a:fmtBRL0(s.spend),o:near(s.spend,fmtBRL0)});
  Q.push({q:"What is the crew's 5% commission?",a:fmtBRL0(s.commission),o:near(s.commission,fmtBRL0)});
  Q.push({q:"How many different stores have we bought from?",a:String(s.stores),o:near(s.stores,String)});
  Q.push({q:"How many orders are in the tracker?",a:String(s.orders),o:near(s.orders,String)});
  const prods=Object.entries(s.byProd).sort((a,b)=>b[1].q-a[1].q);if(prods.length>=2)Q.push({q:"Which product has the most units?",a:short(prods[0][0],40),o:prods.slice(0,4).map(p=>short(p[0],40)).sort(()=>Math.random()-.5)});
  const bySpend=Object.entries(s.byProd).sort((a,b)=>b[1].v-a[1].v);if(bySpend.length>=2)Q.push({q:"Which product has the biggest spend?",a:short(bySpend[0][0],40),o:bySpend.slice(0,4).map(p=>short(p[0],40)).sort(()=>Math.random()-.5)});
  if(s.rows&&s.rows.length){const top=s.rows.slice().sort((a,b)=>(num(b[3])||0)-(num(a[3])||0));const stores=[...new Set(top.map(r=>String(r[0]).trim()))];if(stores.length>=4)Q.push({q:"Which store got our single biggest order?",a:stores[0],o:[stores[0],...stores.slice(1).sort(()=>Math.random()-.5).slice(0,3)].sort(()=>Math.random()-.5)});}
  if(s.palletSource==="shipping")Q.push({q:"How many items are on the current pallet (SHIPPING tab)?",a:fmtN(s.palletItems),o:near(s.palletItems,fmtN)});
  return Q.sort(()=>Math.random()-.5).slice(0,5);}
function gQuiz(area){const Q=quizQs();let i=0,sc=0;const render=()=>{area.innerHTML="";if(!Q.length){area.append(el("div",{class:"note"},"No tracker data loaded yet."));return;}
  if(i>=Q.length){area.append(el("p",{style:"font-size:22px"},`Score: ${sc}/${Q.length}. Best ${best("quiz",sc)}/${Q.length}`),el("button",{class:"btn green",onclick:()=>{gameStop=gQuiz(area)||null;}},"PLAY AGAIN"),el("div",{class:"note"},"All answers come from the live tracker (or snapshot)."));return;}
  const q=Q[i];area.append(el("div",{class:"note"},`Question ${i+1}/${Q.length} · from ${$("dataPill").textContent.includes("LIVE")?"live tracker":"snapshot"}`),el("p",{style:"font-size:21px;margin:6px 0"},q.q));
  q.o.forEach(o=>{const b=el("button",{class:"qopt",onclick:()=>{const ok=o===q.a;if(ok)sc++;b.classList.add(ok?"ok":"bad");area.querySelectorAll(".qopt").forEach(x=>{x.disabled=true;if(x.textContent===q.a)x.classList.add("ok");});beep(ok?880:200,.08);setTimeout(()=>{i++;render();},1100);}},o);area.append(b);});};render();return null;}
