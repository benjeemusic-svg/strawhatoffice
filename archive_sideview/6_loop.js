/* ================= OVERLAY: name tags, speech bubbles, room labels ================= */
const stage=$("stage");let SCALE=2, BOB=0;
agents.forEach(a=>{a.el=document.createElement("div");a.el.className="tag";a.el.innerHTML='<b></b><span class="st"></span>';a.el.querySelector("b").textContent=a.name;a.el.querySelector(".st").textContent=a.status;stage.appendChild(a.el);});
const ROOMS=[["GALLEY",60,125],["LIBRARY",154,125],["SICK BAY · DEAL DESK",254,125],["CARGO HOLD",74,170],["LEDGER ROOM",244,170],["CROW'S NEST",256,8],["LAWN DECK",318,84]];
const roomEls=ROOMS.map(([n,x,y])=>{const e=document.createElement("div");e.className="room";e.textContent=n;stage.appendChild(e);return {e,x,y};});
const floaties=[], sparkles=[];
function floaty(text,x,y){const e=document.createElement("div");e.className="floaty";e.textContent=text;stage.appendChild(e);floaties.push({e,x,y,life:2200});}
function celebrate(n){beep(523,.1);setTimeout(()=>beep(659,.1),110);setTimeout(()=>beep(784,.15),220);floaty(`+${n} items!`,216,178);for(let i=0;i<24;i++)sparkles.push({x:216,y:186,vx:(Math.random()-.5)*60,vy:-30-Math.random()*40,life:1500});}
let talkIdx=0, hoverAgent=null; setInterval(()=>{talkIdx=(talkIdx+1)%agents.length;},4200);

function fit(){const wrap=$("stageWrap"),aw=wrap.clientWidth-24,ah=Math.max(260,window.innerHeight-(document.querySelector("header").offsetHeight+80));
  const s=Math.max(1,Math.min(aw/W,ah/H)); SCALE=s; cv.style.width=Math.round(W*s)+"px"; cv.style.height=Math.round(H*s)+"px";
  roomEls.forEach(r=>r.e.style.fontSize=Math.max(6,Math.round(s*3.2))+"px");}
window.addEventListener("resize",fit);

/* ================= SKY / SEA ================= */
const sky=mk(W,150,g=>{for(let y=0;y<150;y++)R(g,0,y,W,1,lerpC("#3a9ee8","#cdeeff",Math.pow(y/150,1.3)));
  for(const [r,a] of [[44,.05],[32,.07],[22,.1],[15,.16]])disc(g,70,34,r,`rgba(255,246,205,${a})`);
  disc(g,70,34,10,"#fff4c8");disc(g,70,34,8,"#ffffff");
  for(let x=0;x<70;x++){const h=Math.max(0,Math.round(6*Math.sin(x/70*Math.PI)+2*Math.sin(x/9)));R(g,404+x,150-h,1,h,"#7f9fc8");}
  for(let x=0;x<40;x++){const h=Math.round(4*Math.sin(x/40*Math.PI));R(g,10+x,150-h,1,h,"#8fb0d4");}});
function cloudImg(w){const n=Math.max(2,Math.floor(w/10));return outlined(mk(w,18,g=>{for(let i=0;i<n;i++){const cx=6+i*(w-12)/(n-1),r=4+((i*5)%3)+(i===Math.floor(n/2)?3:0);disc(g,Math.round(cx),14-r,r,"#ffffff");}R(g,3,11,w-6,6,"#ffffff");R(g,3,15,w-6,2,"#dfeaf5");}),"rgba(150,180,215,.9)");}
const clouds=[{img:cloudImg(46),x:120,y:12,v:-2.5},{img:cloudImg(30),x:330,y:40,v:-4},{img:cloudImg(60),x:400,y:4,v:-1.8},{img:cloudImg(24),x:20,y:62,v:-5},{img:cloudImg(36),x:250,y:76,v:-6}];
const gulls=[{x:60,y:44,v:7},{x:300,y:54,v:-5},{x:420,y:26,v:4}];
const foam=[];let fishT=-1,fishX=0;
function band(y0,y1,t,spd,len,col,gap){for(let y=y0;y<y1;y+=4){const off=(t*spd/1000+y*13)%gap;for(let x=-gap;x<W+gap;x+=gap)R(ctx,Math.round(x+((y*7)%gap)-off),y,len,1,col);}}

/* ================= RENDER LOOP ================= */
let lastT=performance.now();
function frame(now){const dt=Math.min(100,now-lastT);lastT=now;const t=now;
  HOOK.tick.forEach(f=>f(dt,t));
  agents.forEach(a=>{if(a.anim){if(performance.now()-a.anim.t0>a.anim.dur)a.anim=null;}else if(!a.combo)updateAgent(a,dt);});
  BOB=Math.round(Math.sin(t/1100)*WORLD.bobAmp);
  ctx.drawImage(sky,0,0);
  clouds.forEach(c=>{c.x+=c.v*dt/1000;if(c.x<-c.img.width)c.x=W+Math.random()*40;ctx.drawImage(c.img,Math.round(c.x),c.y);});
  gulls.forEach(gl=>{gl.x+=gl.v*dt/1000;if(gl.x>W+10)gl.x=-10;if(gl.x<-10)gl.x=W+10;const f=Math.floor(t/260+gl.y)%2,x=gl.x|0,y=gl.y+Math.round(Math.sin(t/900+gl.x/40)*2);R(ctx,x,y+(f?0:1),3,1,"#fff");R(ctx,x+3,y+(f?1:0),1,1,"#fff");R(ctx,x+4,y+(f?0:1),3,1,"#fff");});
  HOOK.sky.forEach(f=>f(t));
  // sea + parallax waves + sun glare
  for(let y=150;y<H;y+=2)R(ctx,0,y,W,2,lerpC("#4aa6e6","#0f4f8e",(y-150)/120));
  R(ctx,0,150,W,1,"#e8f6ff");
  band(152,170,t,6,4,"rgba(255,255,255,.45)",26);band(170,200,t,12,7,"rgba(255,255,255,.4)",34);
  for(let i=0;i<10;i++){const y=152+i*5,w=10-i;if(Math.floor(t/180+i)%3)R(ctx,Math.round(70-w/2+Math.sin(t/300+i)*3),y,w,1,"rgba(255,250,220,.85)");}
  HOOK.horizon.forEach(f=>f(t));
  // ---- ship layer (gentle bob) ----
  ctx.save();ctx.translate(0,BOB);
  ctx.drawImage(ship,0,0);
  for(let i=0;i<12;i++){const yo=Math.round(Math.sin(i/2-t/200));R(ctx,238+i,yo,1,7,"#1a1a1a");}R(ctx,242,1+Math.round(Math.sin(2-t/200)),5,1,"#f2cc55");R(ctx,243,3+Math.round(Math.sin(2-t/200)),3,2,"#fff");
  for(let i=0;i<3;i++){const p=((t/1400)+i/3)%1;R(ctx,71+Math.round(Math.sin(p*6+i)*2),130-Math.round(p*10),2,2,"rgba(255,255,255,"+(0.75*(1-p)).toFixed(2)+")");}
  for(let i=0;i<3;i++){const p=((t/(5000+i*1700))+i*.33)%1,dir=i%2?1:-1,fx=Math.round(dir>0?251+p*46:299-p*46),fy=177+i*5,c=["#ffb347","#ff6b6b","#ffd24a"][i];R(ctx,fx,fy,4,2,c);R(ctx,fx+(dir>0?-2:4),fy,2,2,c);R(ctx,fx+(dir>0?3:0),fy,1,1,OUTL);}
  for(let i=0;i<4;i++){const p=((t/2600)+i/4)%1;R(ctx,258+i*12,191-Math.round(p*17),1,1,"rgba(255,255,255,.8)");}
  // pallet: boxes fill with the real pallet %
  R(ctx,152,196,40,4,"#a8703a");R(ctx,152,196,40,1,"#c08a4e");R(ctx,151,195,42,1,OUTL);[154,170,186].forEach(x=>R(ctx,x,197,4,3,"#5c3416"));
  const boxes=Math.round(palletPct/100*9);for(let i=0;i<boxes;i++){const c=i%3,r=Math.floor(i/3),x=153+c*13,y=187-r*9;R(ctx,x,y,12,8,"#d9a066");R(ctx,x,y,12,1,"#f0c890");R(ctx,x+5,y,2,8,"#b8862a");R(ctx,x-1,y-1,14,1,OUTL);R(ctx,x-1,y,1,8,OUTL);R(ctx,x+12,y,1,8,OUTL);}
  // lantern glow
  const fl=Math.floor(t/230)%7?1:.6;[[104,130],[200,130],[318,130],[160,174],[320,174],[116,77]].forEach(([x,y])=>{for(const [r,a] of [[18,.05],[12,.06],[7,.08]])disc(ctx,x,y,r,`rgba(255,200,90,${(a*fl).toFixed(3)})`);});
  HOOK.ship.forEach(f=>f(t));
  // depth-sorted props + crew
  const list=props.map(p=>({b:p.base,d:()=>ctx.drawImage(p.img,p.x,p.y)}));
  agents.forEach(a=>list.push({b:a.y,d:()=>{if(a.anim){const P=animPose(a,t);drawActor(ctx,a.id,a.x,a.y+P.dy,P.tt,P.walking,P.dir,levelOf(a.y)!==0,P.noHat);}else drawActor(ctx,a.id,a.x,a.y+comboDy(a,t),t,a.walking,a.dir,levelOf(a.y)!==0);}}));
  list.sort((p,q)=>p.b-q.b).forEach(o=>o.d());
  agents.forEach(a=>{if(a.anim)drawEffect(ctx,a,t);});
  HOOK.fx.forEach(f=>f(t));
  for(let i=sparkles.length-1;i>=0;i--){const s=sparkles[i];s.life-=dt;s.vy+=60*dt/1000;s.x+=s.vx*dt/1000;s.y+=s.vy*dt/1000;if(s.life<=0){sparkles.splice(i,1);continue;}R(ctx,s.x|0,s.y|0,2,2,["#ffd24a","#fff","#7fc8ff"][i%3]);}
  ctx.restore();
  // wake foam (stern) + bow spray
  if(Math.random()<dt/60)foam.push({x:50+Math.random()*8,y:205+Math.random()*4,vx:-16-Math.random()*10,life:2600,max:2600});
  if(Math.random()<dt/140)foam.push({x:372+Math.random()*8,y:203+Math.random()*3,vx:8+Math.random()*8,vy:-6,life:700,max:700});
  for(let i=foam.length-1;i>=0;i--){const f=foam[i];f.life-=dt;if(f.life<=0){foam.splice(i,1);continue;}f.x+=f.vx*dt/1000;if(f.vy!==undefined){f.y+=f.vy*dt/1000;f.vy+=20*dt/1000;}R(ctx,f.x|0,f.y|0,2,1,`rgba(255,255,255,${(f.life/f.max).toFixed(2)})`);}
  // front water over the submerged hull
  for(let x=0;x<W;x+=2){const top=206+Math.round(Math.sin(x/18-t/600)*1.6+Math.sin(x/7+t/400)*0.6);ctx.fillStyle="rgba(22,98,170,.82)";ctx.fillRect(x,top,2,H-top);R(ctx,x,top,2,1,"rgba(220,245,255,.95)");}
  band(212,270,t,22,9,"rgba(255,255,255,.33)",40);
  if(fishT<0){if(Math.random()<dt/6000){fishT=0;fishX=20+Math.random()*420;}}else{fishT+=dt;const p=fishT/900;if(p>1)fishT=-1;else{const x=Math.round(fishX+p*16),y=Math.round(232-Math.sin(p*Math.PI)*16);R(ctx,x,y,4,2,"#f08a24");R(ctx,x-2,y-1,2,1,"#f08a24");R(ctx,x-2,y+2,2,1,"#f08a24");R(ctx,x+3,y,1,1,OUTL);}}
  HOOK.sea.forEach(f=>f(t));
  HOOK.overlay.forEach(f=>f(t));
  // overlay positions
  const ox=cv.offsetLeft+3,oy=cv.offsetTop+3;
  agents.forEach((a,i)=>{const saying=a.say&&t<a.say.until,talk=(i===talkIdx||a===hoverAgent||!!a.anim||saying);a.el.classList.toggle("talk",talk);const stx=a.anim?(EVENTS[a.anim.type].label+(a.anim.text?" "+a.anim.text:"")+(a.anim.preview?" (preview)":"")):saying?a.say.text:(ringing(a)?"☎ needs a decision! ":"")+a.status;if(a._st!==stx){a._st=stx;a.el.querySelector(".st").textContent=stx;}const L=LOOKS[a.id],head=L.tall?30:L.short?22:25;
    if(levelOf(a.y)===0){a.el.classList.add("side");a.el.style.left=(ox+(a.x+9)*SCALE)+"px";a.el.style.top=(oy+(a.y-12+BOB)*SCALE)+"px";}
    else{a.el.classList.remove("side");a.el.style.left=(ox+a.x*SCALE)+"px";a.el.style.top=(oy+(a.y-head+BOB)*SCALE)+"px";}});
  roomEls.forEach(r=>{r.e.style.left=(ox+r.x*SCALE)+"px";r.e.style.top=(oy+(r.y+BOB)*SCALE)+"px";});
  for(let i=floaties.length-1;i>=0;i--){const f=floaties[i];f.life-=dt;f.y-=12*dt/1000;f.e.style.left=(ox+f.x*SCALE)+"px";f.e.style.top=(oy+f.y*SCALE)+"px";f.e.style.opacity=Math.min(1,f.life/600);if(f.life<=0){f.e.remove();floaties.splice(i,1);}}
  requestAnimationFrame(frame);}

/* ================= CLICK / HOVER → PANEL ================= */
let panelAgent=null;
function hitAt(ev){const r=cv.getBoundingClientRect(),x=(ev.clientX-r.left)*W/r.width,y=(ev.clientY-r.top)*H/r.height-BOB;
  return agents.slice().sort((a,b)=>b.y-a.y).find(a=>x>a.x-9&&x<a.x+9&&y>a.y-(LOOKS[a.id].tall?28:24)&&y<a.y+2);}
cv.addEventListener("mousemove",ev=>{hoverAgent=hitAt(ev)||null;cv.style.cursor=hoverAgent?"pointer":"default";});
cv.addEventListener("mouseleave",()=>{hoverAgent=null;});
cv.addEventListener("click",ev=>{const hit=hitAt(ev);if(hit){openPanel(hit);beep(740);}});
function portrait(canvas,id){const g=canvas.getContext("2d");g.imageSmoothingEnabled=false;g.clearRect(0,0,canvas.width,canvas.height);const big=outlined(mk(36,48,gg=>drawChibi(gg,id,18,44,500,false,"down")));g.drawImage(big,Math.round(canvas.width/2)-19,canvas.height-47);}
function openPanel(a){panelAgent=a;$("pPreview").textContent="▶ PREVIEW "+(a.event?a.event.type:"").toUpperCase().replace(/_/g," ");$("pEvent").textContent=evText(a);$("pName").textContent=a.name;$("pRole").textContent=a.role;$("pStatus").textContent=a.status;$("pTime").textContent=fmtTime(a.updatedAt,true);$("pEnergy").textContent=Math.round(a.energy)+"% · "+moodOf(a)+" (simulated)";$("pFriends").textContent=topFriends(a).join(" · ")||"none yet (grows at meetings, brainstorms, combos)";updatePanelNow();portrait($("portrait"),a.id);$("panel").classList.add("show");}
function updatePanelNow(){if(!panelAgent)return;const a=panelAgent;$("pNow").textContent=a.walking?("heading "+SPOTS[a.target].label.replace(/^(at|on|by|in) (the )?/,"to the ")):(SPOTS[a.at]?SPOTS[a.at].label:"idle");}
setInterval(updatePanelNow,500);
const closeP=()=>{$("panel").classList.remove("show");panelAgent=null;};
$("pRing").onclick=()=>{const a=panelAgent;if(!a)return;closeP();a.testRing=performance.now()+6000;};
$("pPreview").onclick=()=>{const a=panelAgent;if(!a||!a.event)return;closeP();playEvent(a,a.event.type,{preview:true});};
function evText(a){const ev=a.event;if(!ev)return "none";return ev.type+" · "+(ev.id&&ev.at?"last "+fmtTime(ev.at,true)+(ev.text?" ("+ev.text+")":""):"none yet");}
$("pClose").onclick=closeP;$("panel").addEventListener("click",e=>{if(e.target.id==="panel")closeP();});document.addEventListener("keydown",e=>{if(e.key==="Escape")closeP();});
function renderRoster(){const el=$("roster");el.innerHTML="";agents.forEach(a=>{const d=document.createElement("div");d.className="crew";const c=document.createElement("canvas");c.width=22;c.height=30;portrait(c,a.id);
  const tx=document.createElement("div");tx.innerHTML='<div class="nm"></div><div class="rl"></div><div class="s"></div><div class="ev"></div>';tx.querySelector(".ev").textContent="⚡ event: "+evText(a);tx.querySelector(".nm").textContent=a.name;const en=document.createElement("div");en.style.fontSize="14px";en.innerHTML='⚡<span class="energy" data-id="'+a.id+'"><i style="width:'+a.energy+'%"></i></span><span></span>';tx.appendChild(en);tx.querySelector(".rl").textContent=a.role;tx.querySelector(".s").textContent="» "+a.status;
  d.append(c,tx);d.onclick=()=>openPanel(a);el.appendChild(d);});}

/* ================= BOOT ================= */
(function crest(){const g=$("crest").getContext("2d");disc(g,8,10,5,"#f4f0e4");R(g,6,9,2,2,OUTL);R(g,9,9,2,2,OUTL);R(g,7,13,3,1,OUTL);R(g,4,3,9,4,"#f2cc55");R(g,1,6,15,2,"#e3b444");R(g,4,6,9,1,"#c8323c");})();
$("guildName").textContent=STATUS.guild; document.title="Pixel Office · "+STATUS.guild;
renderQuests(); renderLog(); renderRoster(); fit(); requestAnimationFrame(frame);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fit);
checkNewEvents();
HOOK.boot.forEach(f=>{try{f();}catch(e){console.warn(e);}});
refresh(true); setInterval(()=>refresh(false),CONFIG.refreshMinutes*60*1000);
</script>
</body>
</html>
