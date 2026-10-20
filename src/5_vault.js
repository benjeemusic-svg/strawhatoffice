/* ================= TREASURE VAULT (cargo hold): gold pile scales with real commission; new-purchase celebration ================= */
const VAULT={x:94,y:296,shown:0,target:0,from:0,t0:0,coins:[]};
const vaultTag=el("div",{class:"room vaulttag"});$("stage").appendChild(vaultTag);
function vaultLevel(){return Math.max(0,Math.min(1,(VAULT.shown||0)/25000));}
HOOK.depth.push(t=>[{b:VAULT.y+22,d:()=>{const{x,y}=VAULT,lv=vaultLevel(),pile=Math.round(lv*10);
  R(ctx,x-1,y-1,30,24,OUTL);R(ctx,x,y+6,28,16,"#7a4a22");R(ctx,x,y+6,28,2,"#a8703a");R(ctx,x,y+13,28,2,"#d4a23a");R(ctx,x+12,y+10,4,6,"#d4a23a");R(ctx,x+13,y+12,2,2,OUTL);
  R(ctx,x+1,y-6,26,7,"#8a5527");R(ctx,x+1,y-6,26,1,"#a8703a");R(ctx,x+1,y-1,26,1,"#d4a23a");
  for(let r=0;r<pile;r++){const w=24-Math.floor(r*1.6);for(let i=0;i<w;i+=2)R(ctx,x+2+(24-w)/2+i|0,y+6-r,2,1,(i+r)%5?"#ffd24a":"#fff6c8");}
  if(pile)for(let i=0;i<3;i++){const s=Math.floor(t/300+i*7)%9;if(s<2)R(ctx,x+5+i*8,y+5-pile+((i*3)%4),1,1,"#fff");}}}]);
HOOK.light.push(()=>[[VAULT.x+14,VAULT.y+6,20+vaultLevel()*14]]);
HOOK.tick.push(dt=>{const now=performance.now();if(VAULT.shown!==VAULT.target){const p=Math.min(1,(now-VAULT.t0)/2500),e=1-Math.pow(1-p,3);VAULT.shown=VAULT.from+(VAULT.target-VAULT.from)*e;if(p>=1)VAULT.shown=VAULT.target;$("bounty").textContent=p>=1?fmtBRL(VAULT.target):fmtBRL0(VAULT.shown);} /* v4.1 V4-7: whole reais while counting, exact cents only at the end (no R$ 12,046.39 flash) */
  for(let i=VAULT.coins.length-1;i>=0;i--){const c=VAULT.coins[i];c.vy+=220*dt/1000;c.y+=c.vy*dt/1000;c.x+=c.vx*dt/1000;if(c.y>=VAULT.y+4){VAULT.coins.splice(i,1);if(Math.random()<.3)beep(1200+Math.random()*400,.03);}}});
HOOK.fx.push(t=>{VAULT.coins.forEach(c=>{R(ctx,c.x|0,c.y|0,3,3,"#ffd24a");R(ctx,c.x|0,c.y|0,1,1,"#fff6c8");R(ctx,(c.x|0)+2,(c.y|0)+2,1,1,"#c99a1e");});
  agents.forEach(a=>{if(!a.carry)return;const x=Math.round(a.x),y=Math.round(a.y-LOOKS[a.id].ht-9);R(ctx,x-7,y-1,14,11,OUTL);R(ctx,x-6,y,12,9,"#b67b3d");R(ctx,x-6,y,12,2,"#d9a066");line(ctx,x-6,y,x+5,y+8,"#8a5527");R(ctx,x-2,y+3,4,3,"#f3ecd6");});});
HOOK.overlay.push(()=>{const L=Math.round(OX+(VAULT.x-6)*SCALE)+"px",T=Math.round(OY+(VAULT.y-18+BOB)*SCALE)+"px",tx="VAULT "+fmtBRL0(VAULT.shown);if(vaultTag._L!==L){vaultTag._L=L;vaultTag.style.left=L;}if(vaultTag._T!==T){vaultTag._T=T;vaultTag.style.top=T;}if(vaultTag._x!==tx){vaultTag._x=tx;vaultTag.textContent=tx;}}); // cached offsets, writes only on change
/* v4.1 (owner: money instantly): the first value is shown as is, no count-up from R$ 0; later changes and REPLAY still count up */
function setVault(v){if(!VAULT.init){VAULT.init=true;VAULT.from=VAULT.shown=VAULT.target=v;return;}VAULT.from=VAULT.shown;VAULT.target=v;VAULT.t0=performance.now();}
function dropCoins(n){for(let i=0;i<n;i++)setTimeout(()=>VAULT.coins.push({x:VAULT.x+6+Math.random()*16,y:VAULT.y-60-Math.random()*20,vx:(Math.random()-.5)*10,vy:0}),i*60);}
let lastOrderCount=null;
HOOK.data.push(s=>{setVault(s.commission);if(lastOrderCount!=null&&s.orders>lastOrderCount){const n=s.orders-lastOrderCount;s.rows.slice(-n).forEach((r,i)=>setTimeout(()=>newPurchase(r,false),i*9000));}lastOrderCount=s.orders;});
function lastPurchase(){return stats&&stats.rows&&stats.rows.length?stats.rows[stats.rows.length-1]:null;}
function toast(html,ms=7000){const t=el("div",{class:"toast",html:v41NumHtml(html)});document.body.appendChild(t);setTimeout(()=>t.classList.add("out"),ms-600);setTimeout(()=>t.remove(),ms);}
function newPurchase(r,replay){if(!r){toast("No purchase rows loaded yet.",3000);return;}const [store,product,qty,total]=r,q=num(qty)||0,v=num(total)||0;
  const esc=s=>String(s).replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"})[c]);
  toast(`<b>🪙 ${replay?"REPLAY · LAST PURCHASE":"NEW PURCHASE LOGGED"}</b><br>${esc(store)} · ${esc(short(product,48))}<br>×${q} · ${fmtBRL(v)} → commission +${fmtBRL(v*CONFIG.commissionRate)}${replay?"<br><small>(replay of the real last tracker row)</small>":""}`);
  if(!replay)addLog("Jinbe",`New purchase: ${store} · ${short(product,40)} ×${q} (${fmtBRL0(v)})`);
  dropCoins(Math.min(30,8+Math.round(q/4)));const cur=stats?stats.commission:0;if(replay){VAULT.from=Math.max(0,cur-v*CONFIG.commissionRate);VAULT.shown=VAULT.from;VAULT.target=cur;VAULT.t0=performance.now()+600;}
  const P=document.querySelector(".commission");if(P){P.classList.remove("flash");void P.offsetWidth;P.classList.add("flash");}
  const z=agents.find(a=>a.id==="zoro");if(z&&!z.anim){say(z,voice("zoro","cargoIn"),2500);goTo(z,"mastfoot",x=>{x.carry=true;emote(x,"!",1500);goTo(x,"pallet",y=>{y.carry=false;say(y,voice("zoro","stowed"),3000);emote(y,"★",2000);y.wait=6000;},true);},true);}
  agents.forEach((a,i)=>{if(a.id==="zoro"||a.anim)return;setTimeout(()=>{a.quirk={k:"hop",t0:performance.now(),dur:2400};emote(a,i%2?"!":"♥",2400);if(i%3===0)say(a,voice(a.id,"cheer")||"Nice haul!",2200);},400+i*120);});
  [523,659,784,1046,1318].forEach((f,i)=>setTimeout(()=>beep(f,.08),i*100));}
cv.addEventListener("click",ev=>{const [x,y]=canvasXY(ev);if(x>VAULT.x-2&&x<VAULT.x+30&&y>VAULT.y-14&&y<VAULT.y+24){ev.stopImmediatePropagation();const s=stats||{};
  openModal("TREASURE VAULT",el("div",{},el("p",{style:"font-size:22px"},"Crew commission: "+fmtBRL(s.commission||0)),el("div",{class:"note"},`5% of ${fmtBRL(s.spend||0)} current-pallet spend from the purchase tracker. The gold pile grows with the commission (full at R$25k).`),el("button",{class:"btn green",style:"margin-top:8px",onclick:()=>{closeModal();newPurchase(lastPurchase(),true);}},"▶ REPLAY LAST PURCHASE")),true);}},true);
