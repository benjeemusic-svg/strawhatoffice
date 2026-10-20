/* ================= CREW SPRITES (original chibi designs) ================= */
const SKIN="#f7c9a0";
const LOOKS={
 luffy:{shirt:"#d6303a",vest:true,legs:"#3a5fcd",shoes:"#c9a26b",bareLegs:true,
   head(g,x,y,dir){R(g,x+3,y+4,10,3,"#1a1a2a");R(g,x+2,y+6,2,3,"#1a1a2a");R(g,x+12,y+6,2,3,"#1a1a2a");if(dir!=="up"){R(g,x+5,y+7,2,1,"#1a1a2a");R(g,x+9,y+7,1,1,"#1a1a2a");}
     if(g.__noHat){R(g,x+3,y+2,10,3,"#1a1a2a");R(g,x+4,y+1,2,1,"#1a1a2a");R(g,x+8,y+1,3,1,"#1a1a2a");}else{R(g,x+4,y,8,4,"#efcf6a");R(g,x+5,y,6,1,"#f8e39a");R(g,x+4,y+3,8,1,"#c0303a");R(g,x,y+4,16,2,"#e3bd55");R(g,x,y+5,16,1,"#b8902f");}},
   face(g,x,y){R(g,x+5,y+11,3,1,"#b04a3a");R(g,x+5,y+9,1,1,"#c0504a");}},
 chopper:{short:true,shirt:"#f2efe6",legs:"#8a5a32",shoes:"#5c3416",skin:"#9a6234",fur:true,arm:"#9a6234",
   head(g,x,y,dir){R(g,x+1,y+1,1,4,"#c9a26b");R(g,x,y+1,1,1,"#c9a26b");R(g,x+2,y,1,2,"#c9a26b");R(g,x+14,y+1,1,4,"#c9a26b");R(g,x+15,y+1,1,1,"#c9a26b");R(g,x+13,y,1,2,"#c9a26b");
     R(g,x+4,y-2,8,6,"#f06c9b");R(g,x+4,y-2,8,1,"#ff9fc0");R(g,x+3,y+4,10,2,"#d94f82");if(dir!=="up"){R(g,x+7,y-1,2,4,"#fff");R(g,x+6,y,4,1,"#fff");R(g,x+5,y+1,1,2,"#fff");R(g,x+10,y+1,1,2,"#fff");R(g,x+6,y+3,4,1,"#fff");}
     R(g,x+3,y+6,10,1,"#9a6234");},
   face(g,x,y){R(g,x+5,y+10,6,3,"#e0b07a");R(g,x+7,y+10,2,1,"#2a1a0c");R(g,x+7,y+12,2,1,"#8b3a2a");}},
 nami:{shirt:"#ffffff",stripe:"#3f6fd1",legs:"#2f55a8",shoes:"#c0703a",
   head(g,x,y,dir){R(g,x+3,y+2,10,4,"#f08a24");R(g,x+2,y+4,2,11,"#f08a24");R(g,x+12,y+4,2,11,"#f08a24");R(g,x+4,y+2,6,1,"#ffb060");
     if(dir==="up")R(g,x+3,y+5,10,9,"#f08a24");else{R(g,x+4,y+6,3,1,"#f08a24");R(g,x+9,y+6,2,1,"#f08a24");R(g,x+2,y+12,1,1,"#ffd24a");}},
   face(g,x,y){R(g,x+7,y+11,2,1,"#c04a4a");}},
 robin:{shirt:"#6a3fa0",legs:"#2a2238",shoes:"#1a1a2a",skin:"#eab48a",item:"book",
   head(g,x,y,dir){R(g,x+3,y+2,10,4,"#231a33");R(g,x+2,y+4,2,12,"#231a33");R(g,x+12,y+4,2,12,"#231a33");R(g,x+5,y+2,5,1,"#3d2f55");
     if(dir==="up")R(g,x+3,y+5,10,10,"#231a33");else{R(g,x+3,y+6,10,1,"#231a33");R(g,x+3,y+5,1,1,"#231a33");}
     R(g,x+5,y+3,6,1,"#4a4a5a");R(g,x+5,y+3,2,1,"#8fb0d0");R(g,x+9,y+3,2,1,"#8fb0d0");},
   face(g,x,y){R(g,x+7,y+11,2,1,"#a04a5a");}},
 usopp:{shirt:"#e9c04a",legs:"#7a5a32",shoes:"#5c3416",skin:"#c98a5a",overalls:"#7a5a32",item:"spyglass",
   head(g,x,y,dir){R(g,x+2,y+3,12,3,"#17110a");R(g,x+1,y+5,2,5,"#17110a");R(g,x+13,y+5,2,5,"#17110a");R(g,x+1,y+10,2,2,"#17110a");R(g,x+13,y+10,2,2,"#17110a");
     R(g,x+3,y+2,10,2,"#3c9a4a");R(g,x+3,y+4,10,1,"#2a7a36");
     if(dir!=="up"){R(g,x+4,y+5,3,2,"#666");R(g,x+9,y+5,3,2,"#666");R(g,x+5,y+5,1,1,"#ffd24a");R(g,x+10,y+5,1,1,"#ffd24a");}else R(g,x+3,y+5,10,8,"#17110a");},
   face(g,x,y,dir){if(dir==="left"){R(g,x+1,y+10,3,1,"#c98a5a");R(g,x+1,y+10,1,1,"#a8693d");}else if(dir==="right"){R(g,x+13,y+10,3,1,"#c98a5a");R(g,x+15,y+10,1,1,"#a8693d");}
     else{R(g,x+7,y+9,2,3,"#b8794a");R(g,x+7,y+11,2,1,"#a8693d");} R(g,x+6,y+12,4,1,"#7a3a2a");}},
 sanji:{shirt:"#1f1f2a",legs:"#1f1f2a",shoes:"#0e0e14",suit:"#3f6fd1",arm:"#1f1f2a",
   head(g,x,y,dir){R(g,x+3,y+3,10,3,"#f5d94a");R(g,x+4,y+2,7,1,"#fff08a");R(g,x+12,y+5,2,4,"#f5d94a");R(g,x+2,y+5,2,5,"#e8c43a");
     if(dir==="up")R(g,x+3,y+5,10,8,"#f5d94a");
     else{R(g,x+3,y+5,5,6,"#f5d94a");R(g,x+4,y+10,3,1,"#e8c43a");R(g,x+8,y+5,2,1,"#f5d94a");R(g,x+9,y+7,3,1,"#c9a52a");R(g,x+11,y+6,1,1,"#c9a52a");R(g,x+12,y+6,1,2,"#c9a52a");}},
   face(g,x,y){R(g,x+8,y+11,2,1,"#b04a3a");}},
 jinbe:{wide:true,shirt:"#2f6f8f",legs:"#1f2a3a",shoes:"#5c3416",skin:"#5b8fd0",arm:"#2f6f8f",kimono:true,
   head(g,x,y,dir){R(g,x+3,y+3,10,2,"#17110a");R(g,x+6,y+1,4,2,"#17110a");R(g,x+2,y+5,1,4,"#17110a");R(g,x+13,y+5,1,4,"#17110a");
     if(dir==="up")R(g,x+3,y+5,10,6,"#17110a");else{R(g,x+4,y+7,3,1,"#1b2a4a");R(g,x+9,y+7,3,1,"#1b2a4a");}},
   face(g,x,y){R(g,x+5,y+11,6,1,"#1b2a4a");R(g,x+5,y+10,1,1,"#fff");R(g,x+10,y+10,1,1,"#fff");R(g,x+7,y+9,2,1,"#4a7ab8");}},
 zoro:{shirt:"#f2f2f2",legs:"#1f1f2a",shoes:"#3b2310",skin:"#e8b98a",haramaki:"#3c9a4a",item:"swords",
   head(g,x,y,dir){R(g,x+3,y+3,10,3,"#4caf50");R(g,x+4,y+2,2,1,"#4caf50");R(g,x+8,y+2,3,1,"#4caf50");R(g,x+2,y+5,1,3,"#4caf50");R(g,x+13,y+5,1,3,"#4caf50");R(g,x+5,y+3,4,1,"#7fd17f");
     if(dir==="up")R(g,x+3,y+5,10,5,"#4caf50");else{R(g,x+4,y+7,3,1,"#2f7a3a");R(g,x+9,y+7,3,1,"#2f7a3a");R(g,x+2,y+9,1,1,"#ffd24a");R(g,x+2,y+11,1,1,"#ffd24a");}},
   face(g,x,y){R(g,x+6,y+11,4,1,"#8a4a3a");}},
 brook:{tall:true,shirt:"#1f1f2a",legs:"#1f1f2a",shoes:"#0e0e14",skin:"#f4f0e4",suit:"#c8323c",arm:"#1f1f2a",item:"violin",
   head(g,x,y,dir){R(g,x+1,y+1,14,5,"#17110a");R(g,x+2,y,12,1,"#17110a");R(g,x+1,y+5,2,6,"#17110a");R(g,x+13,y+5,2,6,"#17110a");
     R(g,x+4,y-5,8,5,"#1a1a22");R(g,x+4,y-2,8,1,"#c8323c");R(g,x+2,y,12,1,"#2a2a33");R(g,x+5,y-5,3,1,"#3a3a44");if(dir==="up")R(g,x+3,y+5,10,7,"#17110a");},
   face(g,x,y){R(g,x+4,y+7,3,3,"#1a1a22");R(g,x+9,y+7,3,3,"#1a1a22");R(g,x+7,y+10,2,1,"#1a1a22");R(g,x+5,y+12,6,1,"#1a1a22");R(g,x+6,y+12,1,1,"#fff");R(g,x+8,y+12,1,1,"#fff");}}
};
function drawChibi(g,id,x,y,t,walking,dir){
  const L=LOOKS[id], lx=L.tall?4:0, ox=Math.round(x)-8, sh=L.short?2:0, oy=Math.round(y)-21+sh-lx;
  const bob=walking?0:(Math.floor(t/450)%2), step=walking?Math.floor(t/140)%2:-1, skin=L.skin||SKIN;
  const legC=L.bareLegs?SKIN:L.legs, wl=L.wide?3:2;
  if(!L.short){const l1=oy+17-(step===0?1:0),l2=oy+17-(step===1?1:0);R(g,ox+(L.wide?4:5),l1,wl,3+lx,legC);R(g,ox+9,l2,wl,3+lx,legC);
    if(L.bareLegs){R(g,ox+5,oy+16,2,2,L.legs);R(g,ox+9,oy+16,2,2,L.legs);}
    R(g,ox+4,l1+2+lx,3,1,L.shoes);R(g,ox+9,l2+2+lx,3,1,L.shoes);}
  else{R(g,ox+5,oy+17-(step===0?1:0),2,2,L.legs);R(g,ox+9,oy+17-(step===1?1:0),2,2,L.legs);R(g,ox+5,oy+18-(step===0?1:0),2,1,L.shoes);R(g,ox+9,oy+18-(step===1?1:0),2,1,L.shoes);}
  const bodyTop=oy+12+(L.short?-1:0), bodyH=L.short?6:5, bx=L.wide?ox+3:ox+4, bw=L.wide?10:8;
  R(g,bx,bodyTop,bw,bodyH,L.shirt);
  if(L.vest){R(g,ox+7,bodyTop,2,bodyH,SKIN);R(g,ox+4,bodyTop+bodyH-1,8,1,"#3a5fcd");}
  if(L.stripe){R(g,ox+4,bodyTop+1,8,1,L.stripe);R(g,ox+4,bodyTop+3,8,1,L.stripe);}
  if(L.overalls){R(g,ox+5,bodyTop+2,6,bodyH-2,L.overalls);R(g,ox+5,bodyTop,1,2,L.overalls);R(g,ox+10,bodyTop,1,2,L.overalls);}
  if(L.suit){R(g,ox+7,bodyTop,2,bodyH-1,"#ffffff");R(g,ox+7,bodyTop+1,2,bodyH-2,L.suit);R(g,ox+6,bodyTop,1,2,"#ffffff");R(g,ox+9,bodyTop,1,2,"#ffffff");}
  if(L.kimono){R(g,bx+3,bodyTop,1,3,"#e9e2cf");R(g,bx+bw-4,bodyTop,1,3,"#e9e2cf");R(g,bx+4,bodyTop+2,bw-8,1,"#e9e2cf");R(g,bx,bodyTop+bodyH-2,bw,2,"#d9622b");R(g,bx+1,bodyTop+1,1,1,"#5aa0c0");R(g,bx+bw-2,bodyTop+2,1,1,"#5aa0c0");}
  if(L.haramaki)R(g,bx,bodyTop+bodyH-2,bw,2,L.haramaki);
  if(L.fur){R(g,ox+7,bodyTop,2,bodyH,"#d8d2c0");R(g,ox+5,bodyTop+2,1,1,"#e0424f");}
  const sw=walking?(step?1:-1):0, armC=L.arm||(L.vest?SKIN:skin);
  R(g,bx-1,bodyTop+(sw>0?1:0),1,4,armC);R(g,bx+bw,bodyTop+(sw<0?1:0),1,4,armC);R(g,bx-1,bodyTop+4+(sw>0?1:0),1,1,skin);R(g,bx+bw,bodyTop+4+(sw<0?1:0),1,1,skin);
  if(L.item==="spyglass"&&!walking){R(g,ox+12,bodyTop+1,5,2,"#d4a23a");R(g,ox+16,bodyTop+1,1,2,"#8a6a1a");}
  if(L.item==="book"&&!walking){R(g,ox+10,bodyTop+2,4,3,"#7a2e3a");R(g,ox+11,bodyTop+2,1,3,"#e9d3a0");}
  if(L.item==="swords"){const sx=ox+12,sy=bodyTop+bodyH-2;[["#f2f2f2",0],["#1a1a1a",1],["#c8323c",2]].forEach(([c,i])=>{R(g,sx+i,sy-1+i,1,4,c);R(g,sx+i,sy-2+i,1,1,"#d4a23a");});}
  if(L.item==="violin"&&!walking){R(g,ox+1,bodyTop-1,4,5,"#a8582a");R(g,ox+2,bodyTop,2,3,"#7a3a1a");R(g,ox+4,bodyTop-3,1,3,"#5c3416");line(g,ox-1,bodyTop+5,ox+6,bodyTop-2,"#e9d3a0");}
  const hx=ox, hy=oy-bob+(L.short?1:0);
  R(g,hx+3,hy+5,10,8,skin);R(g,hx+4,hy+4,8,1,skin);R(g,hx+4,hy+13,8,1,skin);
  if(L.wide){R(g,hx+2,hy+6,1,6,skin);R(g,hx+13,hy+6,1,6,skin);}
  if(dir!=="up"){
    const ex=dir==="left"?-1:dir==="right"?1:0, blink=(Math.floor(t/100)%38===0), ey=hy+(L.fur?7:8);
    if(blink){R(g,hx+5+ex,ey+1,2,1,OUTL);R(g,hx+9+ex,ey+1,2,1,OUTL);}
    else{R(g,hx+5+ex,ey,2,2,OUTL);R(g,hx+9+ex,ey,2,2,OUTL);R(g,hx+5+ex,ey,1,1,"#fff");R(g,hx+9+ex,ey,1,1,"#fff");}
    if(!L.fur&&id!=="brook"){R(g,hx+4,hy+10,1,1,"#ff9fa8");R(g,hx+11,hy+10,1,1,"#ff9fa8");}
    L.face(g,hx+ex,hy,dir);
  }
  L.head(g,hx,hy,dir);
}
// outlined actor rendering via offscreen buffers + soft shadow
const offA=mk(36,48), offS=mk(36,48), ogA=offA.getContext("2d"), ogS=offS.getContext("2d");
function drawActor(c,id,x,y,t,walking,dir,shadow=true,noHat=false){
  ogA.clearRect(0,0,36,48);ogA.__noHat=noHat;costume(ogA,id,"back",dir);drawChibi(ogA,id,18,44,t,walking,dir);costume(ogA,id,"front",dir);ogA.__noHat=false;
  ogS.globalCompositeOperation="source-over";ogS.clearRect(0,0,36,48);ogS.drawImage(offA,0,0);ogS.globalCompositeOperation="source-in";ogS.fillStyle=OUTL;ogS.fillRect(0,0,36,48);
  const X=Math.round(x)-18,Y=Math.round(y)-44;
  if(shadow){c.fillStyle="rgba(20,10,0,.28)";c.fillRect(Math.round(x)-6,Math.round(y)-1,12,2);c.fillRect(Math.round(x)-4,Math.round(y)+1,8,1);}
  c.drawImage(offS,X-1,Y);c.drawImage(offS,X+1,Y);c.drawImage(offS,X,Y-1);c.drawImage(offS,X,Y+1);c.drawImage(offA,X,Y);
}

/* ================= CREW & MOVEMENT ================= */
const SPOTS={
  helm:{x:147,y:114,label:"at the helm"}, board:{x:132,y:114,label:"reading the quest board"}, maptable:{x:194,y:114,label:"at the map table"},
  grove:{x:280,y:114,label:"by the tangerine grove"}, bowdeck:{x:372,y:114,label:"on the bow deck"}, lion:{x:400,y:114,label:"by the lion figurehead"}, mastfoot:{x:214,y:114,label:"at the foot of the mast"},
  nest:{x:222,y:25,label:"on lookout in the crow's nest"}, nest2:{x:248,y:25,label:"peering through the spyglass"},
  galley:{x:110,y:162,label:"at the galley counter"}, stove:{x:90,y:162,label:"at the stove"},
  library:{x:192,y:162,label:"reading at the library desk"}, shelves:{x:166,y:162,label:"browsing the shelves"},
  dealdesk:{x:302,y:162,label:"at the deal desk"}, dealboard:{x:352,y:162,label:"checking the deal board"}, meds:{x:268,y:162,label:"at the medicine cabinet"},
  cargo:{x:142,y:200,label:"guarding the cargo hold"}, crates:{x:104,y:200,label:"counting crates"}, chest:{x:198,y:200,label:"checking the card-pack chest"}, pallet:{x:176,y:200,label:"checking the pallet"},
  ledger:{x:312,y:200,label:"at the ledger desk"}, aquarium:{x:270,y:200,label:"by the aquarium"},
  rest1:{x:346,y:114,label:"resting on the break lawn"}, rest2:{x:358,y:114,label:"napping on the break lawn"},
  meal1:{x:98,y:162,label:"eating at the galley"}, meal2:{x:122,y:162,label:"eating at the galley"}, meal3:{x:131,y:162,label:"eating at the galley"}, meal4:{x:146,y:162,label:"eating at the galley"},
  c1:{x:300,y:114,label:"hanging out on deck"}, c2:{x:318,y:114,label:"hanging out on deck"},
  m0:{x:222,y:114,label:"leading the crew meeting"}
};
[178,192,206,250,264,278,292,306].forEach((x,i)=>SPOTS["m"+(i+1)]={x,y:114,label:"at the crew meeting by the mast"});
const AG={
  luffy:{home:"helm",visits:["board","maptable","bowdeck","lion","galley","pallet","nest2"]},
  chopper:{home:"dealdesk",visits:["dealboard","meds","library","galley"]},
  nami:{home:"maptable",visits:["grove","board","helm","library","lion"]},
  robin:{home:"library",visits:["shelves","aquarium","dealboard","maptable"]},
  usopp:{home:"nest",visits:["nest2","lion","board","bowdeck","nest2"]},
  sanji:{home:"galley",visits:["stove","maptable","dealboard","chest"]},
  jinbe:{home:"ledger",visits:["aquarium","pallet","board","library"]},
  zoro:{home:"cargo",visits:["crates","pallet","chest","mastfoot","bowdeck"]},
  brook:{home:"bowdeck",visits:["lion","grove","mastfoot","galley"]}};
const agents=STATUS.agents.filter(a=>LOOKS[a.id]).map(a=>{const cfg=AG[a.id]||{home:"helm",visits:["board"]},h=SPOTS[cfg.home];return Object.assign({},a,cfg,{x:h.x,y:h.y,path:[],dir:"down",walking:false,wait:2500+Math.random()*7000,at:cfg.home,state:(a.state||"working").toLowerCase(),decision:a.decision||null,energy:LS.get("energy."+a.id,60+Math.round(Math.random()*40))});});
function routeTo(a,spot){const s=SPOTS[spot];let L=levelOf(a.y);const L2=levelOf(s.y),pts=[];
  while(L!==L2){const n=L+(L2>L?1:-1),lx=LINKX[Math.min(L,n)+"-"+Math.max(L,n)];pts.push({x:lx,y:LY[L]},{x:lx,y:LY[n]});L=n;}
  pts.push({x:s.x,y:s.y});a.path=pts;a.at=null;a.target=spot;}
function updateAgent(a,dt){
  if(a.path.length){const p=a.path[0],dx=p.x-a.x,dy=p.y-a.y,d=Math.hypot(dx,dy),sp=(Math.abs(dy)>0.01&&Math.abs(dx)<0.01?20:30)*(a.fast?2.2:1)*dt/1000;a.walking=true;
    if(d<=sp){a.x=p.x;a.y=p.y;a.path.shift();if(a.redirect){const r=a.redirect;a.redirect=null;routeTo(a,r.spot);a.onArrive=r.cb||null;return;}if(!a.path.length){a.walking=false;a.fast=false;a.at=a.target;a.wait=a.at===a.home?9000+Math.random()*10000:3500+Math.random()*3500;a.dir="down";if(a.onArrive){const f=a.onArrive;a.onArrive=null;f(a);}}}
    else{a.x+=dx/d*sp;a.y+=dy/d*sp;a.dir=Math.abs(dx)>Math.abs(dy)?(dx<0?"left":"right"):"up";}
  } else { a.wait-=dt; if(a.wait<=0){ const n=chooseNext(a); if(n===false){a.wait=1500;return;} routeTo(a, n || (a.at===a.home? a.visits[Math.floor(Math.random()*a.visits.length)] : a.home)); } }
}
/* interrupt-safe routing: re-plans at the next floor node if the agent is mid-walk */
function goTo(a,spot,cb,fast){if(!SPOTS[spot])return;a.fast=!!fast;if(!a.path.length){routeTo(a,spot);a.onArrive=cb||null;}else a.redirect={spot,cb};}
function say(a,text,ms=4000){a.say={text,until:performance.now()+ms};}
