/* ================= CREW EVENTS: signature animations =================
   Each crew member has an event type (status.json → agents[].event.type). When event.id changes,
   the animation plays once on the next load. Preview any of them from the crew member's click panel.
   Future hook for live feeds: window.crewEvent("chopper","deal_found","EB05 case 12% under avg"). */
const EVENTS={
  deal_found:{label:"Deal found!",dur:4200},
  release_found:{label:"New release spotted!",dur:4200},
  margin_report:{label:"Margin report ready.",dur:4500},
  growth_idea:{label:"Growth idea!",dur:4200},
  shipment_update:{label:"Shipment update!",dur:4200},
  books_updated:{label:"Books updated.",dur:4500},
  supplier_deal:{label:"Supplier deal!",dur:4500},
  community_pulse:{label:"Yohohoho! Community pulse",dur:4800},
  summary_sent:{label:"Shishishi! Summary sent!",dur:4500}
};
function playEvent(a,type,opts={}){const E=EVENTS[type];if(!E)return;
  a.anim={type,t0:performance.now(),dur:E.dur,preview:!!opts.preview,text:opts.text||""};a.path=[];a.walking=false;
  if(!opts.preview)addLog(a.name,E.label+(opts.text?" "+opts.text:""),opts.at||new Date().toISOString());
  [523,659,784,1046].forEach((f,i)=>setTimeout(()=>beep(f,.09),i*90));
  if(type==="deal_found"){let d=opts.discount;if(d==null&&opts.text){const m=String(opts.text).match(/(\d+(?:\.\d+)?)\s*%/);if(m)d=+m[1];}if(d!=null&&d>=CONFIG.bigDealPct)bigDeal(a,d,!!opts.preview);}}
function animPose(a,t){const A=a.anim,e=t-A.t0,p=e/A.dur,P={dy:0,dir:"down",walking:false,tt:100,noHat:false};
  switch(A.type){
    case "deal_found":P.dy=-Math.round(Math.abs(Math.sin(p*Math.PI*6))*6);P.dir=["left","down","right","down"][Math.floor(e/220)%4];P.walking=true;P.tt=e;break;
    case "growth_idea":if(p<.25)P.dir=["down","right","up","left"][Math.floor(e/90)%4];break;
    case "summary_sent":P.noHat=p>.5;break;
    case "release_found":P.dir=a.y<60?"right":"down";break;
  }
  return P;}
function star(g,x,y,c){R(g,x,y-1,1,3,c);R(g,x-1,y,3,1,c);}
function note(g,x,y,c){R(g,x,y+3,3,2,c);R(g,x+2,y,1,4,c);R(g,x+3,y,2,1,c);R(g,x+4,y+1,1,1,c);}
function drawEffect(g,a,t){const A=a.anim,e=t-A.t0,p=e/A.dur,x=Math.round(a.x),P=animPose(a,t),y=Math.round(a.y)+P.dy;
  // opening burst
  if(e<500){const r=Math.round(4+e/40);for(let i=0;i<8;i++){const an=i/8*Math.PI*2;star(g,Math.round(x+Math.cos(an)*r),Math.round(y-12+Math.sin(an)*r),i%2?"#fff":"#ffd24a");}}
  switch(A.type){
  case "deal_found":{ // Chopper: happy dance, sparkles, price tag held up
    for(let i=0;i<8;i++){const an=i/8*Math.PI*2+e/500,r=12+Math.round(Math.sin(e/150+i)*3);if((Math.floor(e/120)+i)%3)star(g,Math.round(x+Math.cos(an)*r),Math.round(y-11+Math.sin(an)*r*0.8),["#ffd24a","#fff","#ff9fc0"][i%3]);}
    line(g,x+5,y-10,x+7,y-22,"#c8323c");R(g,x+3,y-30,11,7,OUTL);R(g,x+4,y-29,9,5,"#fff4c8");R(g,x+5,y-28,1,1,"#c8323c");R(g,x+7,y-28,1,3,"#2f7a3a");R(g,x+9,y-28,2,1,"#2f7a3a");R(g,x+9,y-27,1,1,"#2f7a3a");R(g,x+9,y-26,2,1,"#2f7a3a");break;}
  case "release_found":{ // Usopp: shouts with spyglass, waves a flag
    R(g,x+4,y-13,11,2,"#d4a23a");R(g,x+14,y-14,2,4,"#8a6a1a");R(g,x+4,y-13,11,1,"#ffe27a");
    if(Math.floor(e/160)%2){line(g,x+18,y-18,x+23,y-22,"#fff");line(g,x+19,y-14,x+25,y-14,"#fff");line(g,x+18,y-10,x+23,y-7,"#fff");}
    const w=Math.floor(e/150)%2,fh=a.y<60?18:26;line(g,x-5,y-8,x-12,y-fh,"#6b3f1c");R(g,x-23,y-fh-1+w,11,6,OUTL);R(g,x-22,y-fh+w,9,4,"#c8323c");R(g,x-19,y-fh+1+w,3,2,"#fff");
    const ey=a.y<60?y-22:y-30;R(g,x+20,ey,2,6,"#ffd24a");R(g,x+20,ey+7,2,2,"#ffd24a");break;}
  case "margin_report":{ // Robin: sprouting extra arms holding charts and papers
    const k=Math.min(1,p*3),spots=[[-14,-18,0],[14,-18,1],[-16,-8,1],[16,-8,0]];
    spots.forEach(([dx,dy,chart],i)=>{if(p<i*0.08)return;const hx=Math.round(x+dx*k),hy=Math.round(y-12+(dy+12)*k);line(g,x+(dx<0?-4:4),y-12,hx,hy,"#eab48a");line(g,x+(dx<0?-4:4),y-11,hx,hy+1,"#d9a070");
      R(g,hx-4,hy-8,8,8,OUTL);R(g,hx-3,hy-7,6,6,"#fffaf0");if(chart){for(let b=0;b<3;b++)R(g,hx-2+b*2,hy-2-b,1,2+b,"#3c9a4a");}else{R(g,hx-2,hy-6,4,1,"#8b8070");R(g,hx-2,hy-4,4,1,"#8b8070");R(g,hx-2,hy-2,3,1,"#8b8070");}
      if(Math.floor(e/400+i)%5===0)star(g,hx+5,hy-8,"#e0b0ff");});break;}
  case "growth_idea":{ // Nami: beri-sign eyes + spinning staff
    const ox=x-8,ey=Math.round(a.y)-21+8;[ox+5,ox+9].forEach(ex=>{R(g,ex-1,ey-1,4,4,"#ffd24a");R(g,ex,ey-2,1,6,"#8a5a00");R(g,ex+1,ey,1,1,"#8a5a00");});
    const an=e/70,cx=x+6,cy=y-11;line(g,Math.round(cx-Math.cos(an)*10),Math.round(cy-Math.sin(an)*10),Math.round(cx+Math.cos(an)*10),Math.round(cy+Math.sin(an)*10),"#3f6fd1");
    R(g,Math.round(cx+Math.cos(an)*10)-1,Math.round(cy+Math.sin(an)*10)-1,2,2,"#fff");R(g,Math.round(cx-Math.cos(an)*10)-1,Math.round(cy-Math.sin(an)*10)-1,2,2,"#fff");
    for(let i=0;i<4;i++){const q=((e/1200)+i/4)%1;const cxx=x-10+i*7,cyy=Math.round(y-18-q*16);disc(g,cxx,cyy,2,"#ffd24a");R(g,cxx,cyy-1,1,3,"#b8862a");}break;}
  case "shipment_update":{ // Zoro: crate overhead + sword flashes
    const k=Math.min(1,p*4),top=Math.round(y-31-k*6);line(g,x-5,y-12,x-5,top+9,"#e8b98a");line(g,x+5,y-12,x+5,top+9,"#e8b98a");
    R(g,x-8,top-1,16,11,OUTL);R(g,x-7,top,14,9,"#b67b3d");R(g,x-7,top,14,1,"#d9a066");for(let i=0;i<9;i++)R(g,x-7+Math.round(i*14/9),top+i,1,1,"#8a5527");R(g,x-3,top+3,6,3,"#f3ecd6");R(g,x-2,top+4,4,1,"#c8323c");
    if(Math.floor(e/180)%2){line(g,x+6,y-11,x+13,y-4,"#ffffff");star(g,x+13,y-4,"#fff");}
    if(p>.4){const sw=(e%700)/700*Math.PI;for(let i=0;i<10;i++){const an=-Math.PI*0.9+sw*0.9+i*0.06;R(g,Math.round(x+Math.cos(an)*16),Math.round(y-10+Math.sin(an)*12),2,1,"rgba(255,255,255,.9)");}}break;}
  case "books_updated":{ // Jinbe: stamps the ledger + waves of water
    for(let k=0;k<3;k++){const r=((e/25)+k*14)%42;if(r<3)continue;for(let an=Math.PI*1.05;an<Math.PI*1.95;an+=0.12)R(g,Math.round(x+Math.cos(an)*r),Math.round(y-2+Math.sin(an)*r*0.45),2,1,`rgba(140,210,255,${(1-r/42).toFixed(2)})`);}
    for(let i=0;i<5;i++){const q=((e/900)+i/5)%1;R(g,x-12+i*6,Math.round(y-4-Math.sin(q*Math.PI)*10),1,2,"#8fd3ff");}
    const s=(e%900)/900,sy=Math.round(y-14-Math.abs(Math.cos(s*Math.PI))*9),hits=Math.floor(e/900);
    for(let i=0;i<Math.min(hits,4);i++){R(g,x+6+i*4,y-11,3,2,"#c8323c");}
    R(g,x+11,sy-6,2,5,"#7a4a22");R(g,x+10,sy-7,4,2,"#a8703a");R(g,x+8,sy-1,8,3,"#c8323c");R(g,x+8,sy+2,8,1,OUTL);break;}
  case "supplier_deal":{ // Sanji: twirls a plate with a heart + flame kick
    line(g,x+6,y-11,x+7,y-22,"#1f1f2a");const rot=e/120,w=Math.max(1,Math.round(Math.abs(Math.cos(rot))*6));R(g,x+7-w-1,y-25,w*2+3,4,OUTL);R(g,x+7-w,y-24,w*2+1,2,"#ffffff");
    if(w>3){R(g,x+6,y-28,1,1,"#e0424f");R(g,x+8,y-28,1,1,"#e0424f");R(g,x+6,y-27,3,1,"#e0424f");R(g,x+7,y-26,1,1,"#e0424f");}
    if(p>.45){const fl=Math.floor(e/90);R(g,x-12,y-7,10,2,"#1f1f2a");R(g,x-14,y-7,2,2,"#0e0e14");for(let i=0;i<9;i++){const fx=x-15+i*-1+((fl+i)%3),fy=y-9+((i*7+fl)%5)-2;R(g,fx-i,fy,2,2,i%3?"#ff8a1e":"#ffd24a");}disc(g,x-16,y-7,2,"#ff5a1e");}
    for(let i=0;i<3;i++){const q=((e/1500)+i/3)%1;const hx=x+12+i*3,hy=Math.round(y-20-q*14);R(g,hx,hy,1,1,"#ff6b8a");R(g,hx+2,hy,1,1,"#ff6b8a");R(g,hx,hy+1,3,1,"#ff6b8a");R(g,hx+1,hy+2,1,1,"#ff6b8a");}break;}
  case "community_pulse":{ // Brook: violin solo + music notes
    const bx=Math.round(Math.sin(e/110)*4);R(g,x-8,y-17,5,6,"#a8582a");R(g,x-7,y-16,3,4,"#7a3a1a");line(g,x-12+bx,y-9,x-2+bx,y-19,"#e9d3a0");
    for(let i=0;i<6;i++){const q=((e/1800)+i/6)%1;note(g,Math.round(x-10+i*5+Math.sin(q*6+i)*4),Math.round(y-22-q*26),["#ffd24a","#7fc8ff","#ff9fc0","#a6f27c"][i%4]);}break;}
  case "summary_sent":{ // Luffy: stretchy arm reach, laughs, holds up his hat
    if(p<.5){const L=Math.round(44*Math.sin(p/.5*Math.PI)),ex=x+4+L,ey=Math.round(y-11-L*0.25);line(g,x+4,y-11,ex,ey,"#f7c9a0");line(g,x+4,y-10,ex,ey+1,"#e0a878");R(g,ex-1,ey-2,4,4,OUTL);R(g,ex,ey-1,3,3,"#f7c9a0");
      for(let i=0;i<3;i++)R(g,x+8+i*9,Math.round(y-9-i*2),3,1,"rgba(255,255,255,.7)");}
    else{const hy=y-33+Math.round(Math.sin(e/150));line(g,x+5,y-12,x+5,hy+5,"#f7c9a0");R(g,x-4,hy-1,18,9,OUTL);R(g,x+1,hy,8,4,"#efcf6a");R(g,x+2,hy,6,1,"#f8e39a");R(g,x+1,hy+3,8,1,"#c0303a");R(g,x-3,hy+4,16,2,"#e3bd55");R(g,x-3,hy+5,16,1,"#b8902f");
      for(let i=0;i<4;i++)star(g,x-10+i*9,y-30+((i*5+Math.floor(e/200))%6),i%2?"#fff":"#ffd24a");}break;}
  }}
window.crewEvent=(id,type,text,discount)=>{const a=agents.find(x=>x.id===id);if(!a)return false;const ev={type:type||a.event.type,id:"live-"+Date.now(),at:new Date().toISOString(),text:text||null,discount:discount==null?null:+discount};a.event=ev;LS.set("evt."+a.id,ev.id);recordHistory(a,ev);playEvent(a,ev.type,{text:ev.text||"",discount:ev.discount});renderRoster();return true;};
/* real event history (status.json eventHistory + events seen in this browser) → bounties, MVP, achievements */
function recordHistory(a,ev){const h=LS.get("history",[]);if(h.some(x=>x.id===String(ev.id)))return;h.push({crew:a.id,type:ev.type,at:ev.at||new Date().toISOString(),id:String(ev.id),discount:ev.discount==null?null:ev.discount});LS.set("history",h.slice(-500));}
function allHistory(){const seen=new Set(),out=[];[...(STATUS.eventHistory||[]),...LS.get("history",[])].forEach(x=>{const k=String(x.id||x.at+x.crew);if(seen.has(k))return;seen.add(k);out.push(x);});return out;}
let evDelay=1200;
function queueEventIfNew(a){const ev=a.event;if(!ev||!ev.id)return;const key="evt."+a.id;if(LS.get(key,null)===String(ev.id))return;LS.set(key,String(ev.id));recordHistory(a,ev);
  const d=evDelay;evDelay+=5000;setTimeout(()=>{playEvent(a,ev.type,{text:ev.text||"",at:ev.at||undefined,discount:ev.discount});evDelay=Math.max(1200,evDelay-5000);},d);}
function checkNewEvents(){agents.forEach(queueEventIfNew);}
