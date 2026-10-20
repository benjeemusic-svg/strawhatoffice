/* ================= CREW: sharper 24x32 sprites, 4-direction walk cycles (original pixel designs) ================= */
const DK=c=>lerpC(c,"#000000",.28), LT=c=>lerpC(c,"#ffffff",.3);
const SZ={n:{hw:14,hh:13,tw:10,th:9,leg:6},short:{hw:14,hh:12,tw:9,th:6,leg:3},tall:{hw:14,hh:13,tw:9,th:10,leg:9},wide:{hw:16,hh:13,tw:14,th:10,leg:6}};
/* geometry G: cx,y(feet),dir(down|up|left),f(0-3),yL,yT,yH,lx,hx,tw,th,hw,hh */
const hairCap=(G,col,rows,ext=0)=>{const{g,hx,hw,yH}=G;R(g,hx+1-ext,yH-1,hw-2+ext*2,1,col);R(g,hx-ext,yH,hw+ext*2,rows,col);R(g,hx+2,yH-1,hw-6,1,LT(col));};
const sideBurn=(G,col,len)=>{const{g,hx,hw,yH,dir}=G;if(dir!=="left")R(g,hx,yH,1,len,col);R(g,hx+hw-1,yH,1,len,col);};
const backHair=(G,col)=>{const{g,hx,hw,yH,hh}=G;R(g,hx,yH,hw,hh-2,col);R(g,hx+1,yH+hh-2,hw-2,1,col);R(g,hx+3,yH,hw-8,1,LT(col));};
const LOOKS={
 luffy:{size:"n",skin:"#f7c9a0",top:"#c8323c",bottom:"#3f6fd1",shorts:3,cuff:"#f2f2f2",shoes:"#8a5527",
  torso(G){const{g,lx,yT,tw,th,dir,cx}=G;R(g,lx,yT,tw,th,"#c8323c");if(dir==="down"){R(g,cx-1,yT,3,th-1,"#f7c9a0");R(g,lx+1,yT+3,1,1,"#ffd24a");R(g,lx+tw-2,yT+3,1,1,"#ffd24a");}if(dir==="left")R(g,lx,yT,2,th-1,"#f7c9a0");R(g,lx,yT+th-1,tw,1,"#3f6fd1");},
  hair(G){const{g,hx,hw,yH,dir,cx,noHat}=G,c="#1a1a1a";if(dir==="up")backHair(G,c);else{hairCap(G,c,4);for(let i=0;i<hw;i+=2)R(g,hx+i,yH+4,1,1+(i%4?1:0),c);sideBurn(G,c,7);if(dir==="down"){R(g,cx+2,yH+10,3,1,"#a8502a");R(g,cx+3,yH+9,1,3,"#a8502a");}}
   if(noHat)return;const y=yH-3;R(g,hx-3,y+4,hw+6,2,"#e3bd55");R(g,hx-3,y+5,hw+6,1,"#b8902f");R(g,hx+1,y-1,hw-2,5,"#efcf6a");R(g,hx+2,y-2,hw-4,1,"#efcf6a");R(g,hx+3,y-1,hw-7,1,"#f8e39a");R(g,hx+1,y+2,hw-2,2,"#c0303a");}},
 zoro:{size:"n",skin:"#e8b98a",bottom:"#2a2a30",shoes:"#141414",sleeve:"#f2f2f2",sleeveRows:2,
  back(G){if(G.dir==="left")return;const{g,lx,tw,yT,th}=G,x=lx+tw-1,y=yT+th-3;[["#f2f2f2",0],["#1a1a1a",2],["#c8323c",4]].forEach(([c,o])=>{line(g,x+1,y+o-2,x+6,y+o-7,c);R(g,x+1,y+o-2,2,1,"#d4a23a");});},
  torso(G){const{g,lx,yT,tw,th,cx,dir}=G;R(g,lx,yT,tw,th,"#f2f2f2");R(g,lx,yT+th-3,tw,3,"#2f7a3a");R(g,lx,yT+th-3,tw,1,"#3c9a4a");if(dir==="down"){R(g,cx-1,yT,2,2,"#e8b98a");R(g,lx+tw-1,yT+1,1,th-4,"#d8d8d8");}
   if(dir==="left"){const x=lx+tw-2,y=yT+th-2;line(g,x,y,x+5,y+4,"#f2f2f2");line(g,x-1,y,x+4,y+4,"#1a1a1a");}},
  hair(G){const{g,hx,hw,yH,dir}=G,c="#4caf50";if(dir==="up"){backHair(G,c);return;}hairCap(G,c,3);for(let i=1;i<hw-1;i+=3)R(g,hx+i,yH-2,2,1,c);if(dir==="down"){R(g,hx-1,yH+8,1,1,"#ffd24a");R(g,hx-1,yH+10,1,1,"#ffd24a");R(g,hx-1,yH+12,1,1,"#ffd24a");}}},
 nami:{size:"n",skin:"#f7c9a0",bottom:"#4a6fa5",shoes:"#a8582a",
  back(G){const{g,hx,hw,yH,yT,dir}=G,c="#f5822a";if(dir==="down"){R(g,hx-1,yH+4,3,yT-yH+5,c);R(g,hx+hw-2,yH+4,3,yT-yH+5,c);}},
  torso(G){const{g,lx,yT,tw,th,dir}=G;R(g,lx,yT,tw,th,"#f7c9a0");for(let r=0;r<4;r++)R(g,lx,yT+r,tw,1,r%2?"#3f6fd1":"#fafafa");R(g,lx,yT+th-2,tw,2,"#4a6fa5");if(dir==="down")R(g,lx-2,yT+2,1,1,"#3f6fd1");if(dir==="up")backHair({...G,hx:lx-1,hw:tw+2,yH:yT-2,hh:8},"#f5822a");},
  hair(G){const{g,hx,hw,yH,dir}=G,c="#f5822a";if(dir==="up"){backHair(G,c);return;}hairCap(G,c,4,1);R(g,hx+2,yH+4,4,1,c);R(g,hx+hw-5,yH+4,3,1,c);if(dir==="left"){R(g,hx+hw-5,yH,6,G.hh+4,c);}else{R(g,hx-1,yH+2,2,11,c);R(g,hx+hw-1,yH+2,2,11,c);}}},
 usopp:{size:"n",skin:"#c98a5a",bottom:"#8a5a2b",shoes:"#5c3416",
  torso(G){const{g,lx,yT,tw,th,cx,dir}=G;R(g,lx,yT,tw,th,"#8a5a2b");if(dir==="down"){R(g,cx-3,yT+1,6,4,"#a8743a");R(g,lx+1,yT,1,3,"#5c3416");R(g,lx+tw-2,yT,1,3,"#5c3416");R(g,lx+1,yT+3,1,1,"#ffd24a");R(g,lx+tw-2,yT+3,1,1,"#ffd24a");}R(g,lx,yT+th-1,tw,1,"#e8c02a");R(g,lx+tw-1,yT+th-4,3,4,"#d4a23a");},
  hair(G){const{g,hx,hw,yH,dir,cx,hh}=G,c="#1a1a1a";if(dir==="up"){backHair(G,c);for(let i=0;i<hw+2;i+=3)R(g,hx-1+i,yH-2,2,2,c);return;}
   hairCap(G,c,3,1);for(let i=0;i<hw+2;i+=3)R(g,hx-1+i,yH-2,2,2,c);R(g,hx-2,yH+2,2,6,c);if(dir!=="left")R(g,hx+hw,yH+2,2,6,c);else R(g,hx+hw-4,yH+2,5,8,c);
   R(g,hx,yH+3,hw,1,"#8a5a2b");const ly=yH+2;if(dir==="down"){[cx-5,cx+2].forEach(x=>{R(g,x,ly,4,3,"#d4a23a");R(g,x+1,ly+1,2,1,"#7fc8ff");});R(g,cx-1,yH+8,2,3,"#c98a5a");R(g,cx-1,yH+10,2,1,"#a86a3a");R(g,cx-1,yH+8,1,1,"#e0a878");}
   else{R(g,hx+1,ly,4,3,"#d4a23a");R(g,hx+2,ly+1,2,1,"#7fc8ff");R(g,hx-5,yH+8,6,2,"#c98a5a");R(g,hx-5,yH+9,6,1,"#a86a3a");}}},
 sanji:{size:"n",skin:"#f7c9a0",bottom:"#1f1f2a",shoes:"#0e0e14",sleeve:"#1f1f2a",sleeveRows:99,
  torso(G){const{g,lx,yT,tw,th,cx,dir}=G;R(g,lx,yT,tw,th,"#1f1f2a");if(dir==="down"){R(g,cx-2,yT,4,4,"#3f6fd1");R(g,cx,yT,1,6,"#14143a");R(g,cx-3,yT,1,5,"#2e2e3e");R(g,cx+2,yT,1,5,"#2e2e3e");R(g,cx-1,yT+6,1,1,"#ffd24a");}if(dir==="left")R(g,lx,yT,2,3,"#3f6fd1");},
  hair(G){const{g,hx,hw,yH,dir,cx}=G,c="#f2d04a";if(dir==="up"){backHair(G,c);return;}hairCap(G,c,4);sideBurn(G,c,6);
   if(dir==="down"){R(g,hx+1,yH+4,7,6,c);R(g,hx+2,yH+10,4,1,c);R(g,hx+3,yH+4,2,1,LT(c));R(g,cx+1,yH+5,4,1,"#7a5a1a");R(g,cx+4,yH+4,1,1,"#7a5a1a");}
   else{R(g,hx,yH+4,4,5,c);R(g,hx+hw-6,yH,6,9,c);}}},
 chopper:{size:"short",skin:"#e0b07a",fur:"#8a5527",bottom:"#e07a2a",shorts:3,legSkin:"#8a5527",shoes:"#3a2410",sleeve:"#8a5527",sleeveRows:99,hand:"#3a2410",
  torso(G){const{g,lx,yT,tw,th,cx,dir}=G;R(g,lx,yT,tw,th,"#8a5527");if(dir==="down")R(g,cx-2,yT+1,4,th-2,"#a8703a");R(g,lx,yT+th-1,tw,1,"#e07a2a");},
  head(G){const{g,hx,hw,hh,yH,dir,cx}=G;R(g,hx+1,yH,hw-2,hh,"#8a5527");R(g,hx,yH+1,hw,hh-2,"#8a5527");if(dir!=="up"){if(dir==="down")R(g,cx-4,yH+5,8,hh-6,"#e0b07a");else R(g,hx+1,yH+5,7,hh-6,"#e0b07a");}},
  face(G){const{g,cx,yH,dir,hx}=G;if(dir==="down"){[cx-4,cx+2].forEach(x=>{R(g,x,yH+6,2,3,"#1a1a1a");R(g,x,yH+6,1,1,"#fff");});R(g,cx-1,yH+9,2,1,"#3f6fd1");R(g,cx-1,yH+10,2,1,"#8a3a2a");}else{R(g,hx+3,yH+6,2,3,"#1a1a1a");R(g,hx+3,yH+6,1,1,"#fff");R(g,hx,yH+9,2,1,"#3f6fd1");}},
  hair(G){const{g,hx,hw,yH,dir,cx}=G;const y=yH-6;R(g,hx-1,yH+1,hw+2,2,"#ff6f9f");R(g,hx+1,y,hw-2,7,"#ff8fb3");R(g,hx+2,y,hw-6,1,"#ffc0d6");R(g,hx+1,y+4,hw-2,1,"#fff");if(dir==="down"){R(g,cx-1,y+1,1,1,"#fff");R(g,cx+1,y+1,1,1,"#fff");R(g,cx,y+2,1,1,"#fff");R(g,cx-1,y+3,1,1,"#fff");R(g,cx+1,y+3,1,1,"#fff");}
   const ant=(x,s)=>{R(g,x,yH-2,1,3,"#c98a4a");R(g,x+s,yH-4,1,3,"#c98a4a");R(g,x+s*2,yH-5,1,2,"#c98a4a");R(g,x+s,yH-1,2,1,"#c98a4a");};if(dir!=="left")ant(hx-2,-1);ant(hx+hw+1,1);}},
 robin:{size:"tall",skin:"#f2c49b",bottom:"#2f3a6a",shoes:"#3a2410",sleeve:"#6a3f9a",sleeveRows:99,
  back(G){const{g,hx,hw,yH,yT,dir}=G,c="#1a1a24";if(dir==="down"){R(g,hx-1,yH+3,3,yT-yH+7,c);R(g,hx+hw-2,yH+3,3,yT-yH+7,c);}},
  torso(G){const{g,lx,yT,tw,th,cx,dir}=G;R(g,lx,yT,tw,th,"#6a3f9a");if(dir==="down"){R(g,cx-1,yT,3,4,"#f2efe6");R(g,lx,yT+th-2,tw,1,"#3a2410");}if(dir==="up")R(g,lx,yT,tw,6,"#1a1a24");},
  hair(G){const{g,hx,hw,yH,dir}=G,c="#1a1a24";if(dir==="up"){backHair(G,c);return;}hairCap(G,c,5,1);R(g,hx+3,yH+5,hw-6,1,c);if(dir==="left")R(g,hx+hw-5,yH,6,G.hh+6,c);else{R(g,hx-1,yH+2,2,12,c);R(g,hx+hw-1,yH+2,2,12,c);}R(g,hx+hw-4,yH-1,3,2,"#c8a2e8");}},
 brook:{size:"tall",skin:"#f4f0e4",bottom:"#1f1f2a",shoes:"#0e0e14",sleeve:"#1f1f2a",sleeveRows:99,hand:"#f4f0e4",lw:2,
  back(G){const{g,cx,yH,dir}=G;disc(g,cx,yH+3,11,"#111");if(dir!=="up"){}},
  torso(G){const{g,lx,yT,tw,th,cx,dir}=G;R(g,lx,yT,tw,th,"#1f1f2a");if(dir==="down"){R(g,cx-2,yT,4,3,"#e9e0c0");R(g,cx-1,yT+3,2,1,"#c8323c");R(g,lx,yT+th-2,1,3,"#1f1f2a");R(g,lx+tw-1,yT+th-2,1,3,"#1f1f2a");}},
  head(G){const{g,hx,hw,hh,yH}=G;R(g,hx+2,yH+2,hw-4,hh-2,"#f4f0e4");R(g,hx+1,yH+3,hw-2,hh-5,"#f4f0e4");},
  face(G){const{g,cx,yH,dir,hx}=G;if(dir==="down"){[cx-5,cx+2].forEach(x=>R(g,x,yH+5,3,3,"#1a1a1a"));R(g,cx-1,yH+8,2,1,"#5a5a5a");R(g,cx-3,yH+10,6,2,"#fff");for(let i=-2;i<3;i+=2)R(g,cx+i,yH+10,1,2,"#5a5a5a");}else{R(g,hx+2,yH+5,3,3,"#1a1a1a");R(g,hx+1,yH+10,4,2,"#fff");}},
  hair(G){const{g,cx,yH,dir}=G;disc(g,cx,yH,9,"#111");R(g,cx-6,yH-6,3,1,"#333");if(dir!=="up"){R(g,cx-6,yH+2,12,1,"#111");}R(g,cx-4,yH-15,9,6,"#141414");R(g,cx-6,yH-10,13,2,"#141414");R(g,cx-4,yH-11,9,1,"#c8323c");}},
 jinbe:{size:"wide",skin:"#5b8fd1",bottom:"#2a2a50",shoes:"#5c3416",sleeve:"#24479a",sleeveRows:99,lw:4,
  torso(G){const{g,lx,yT,tw,th,cx,dir}=G;R(g,lx,yT,tw,th,"#24479a");for(let i=0;i<tw;i+=4)R(g,lx+i,yT+2+(i%8?2:0),2,1,"#16306e");if(dir==="down"){line(g,cx-3,yT,cx,yT+4,"#f2f2f2");line(g,cx+3,yT,cx,yT+4,"#f2f2f2");}R(g,lx,yT+th-3,tw,2,"#d0602a");},
  face(G){const{g,cx,yH,dir,hx}=G;if(dir==="down"){[cx-5,cx+3].forEach(x=>{R(g,x,yH+6,2,2,"#1a1a1a");R(g,x-1,yH+4,4,1,"#1a1a1a");});R(g,cx-2,yH+10,4,1,"#2a3a6a");R(g,cx-3,yH+8,1,2,"#fff");R(g,cx+2,yH+8,1,2,"#fff");}else{R(g,hx+2,yH+6,2,2,"#1a1a1a");R(g,hx+1,yH+4,4,1,"#1a1a1a");R(g,hx,yH+8,1,2,"#fff");}},
  hair(G){const{g,hx,hw,yH,dir,cx}=G,c="#1a1a1a";if(dir==="up"){backHair(G,c);R(g,cx-1,yH+G.hh-2,3,6,c);return;}hairCap(G,c,3);if(dir==="left")R(g,hx+hw-2,yH+3,4,5,c);}},
 /* Frankie: shipwright. Blue pompadour, sunglasses up, open blue floral shirt (v3.1.1: was red), big bare forearms with star marks, blue shorts */
 frankie:{size:"wide",skin:"#f2b98a",bottom:"#1f3470",shorts:3,shoes:"#7a4a22",lw:4,
  torso(G){const{g,lx,yT,tw,th,cx,dir}=G;R(g,lx,yT,tw,th,"#2f7fe0");for(let i=1;i<tw;i+=4){R(g,lx+i,yT+1+(i%3),2,1,"#ffd24a");R(g,lx+i+1,yT+5-(i%2),1,1,"#fff");}
   if(dir==="down"){R(g,cx-2,yT,4,th-3,"#f2b98a");R(g,cx-1,yT+3,2,1,"#d99a6a");}if(dir==="left")R(g,lx,yT,3,th-3,"#f2b98a");
   R(g,lx,yT+th-3,tw,3,"#1f3470");R(g,lx,yT+th-3,tw,1,"#2f4a90");
   if(dir!=="up"){R(g,lx-3,yT+3,1,1,"#1f3470");R(g,lx+tw+1,yT+3,1,1,"#1f3470");}},
  hair(G){const{g,hx,hw,yH,dir,cx}=G,c="#2f9be8";
   if(dir==="up"){backHair(G,c);R(g,hx+1,yH-6,hw-2,6,c);R(g,hx+3,yH-8,hw-6,2,c);return;}
   hairCap(G,c,3,1);R(g,hx+1,yH-6,hw-2,6,c);R(g,hx+3,yH-8,hw-6,2,c);R(g,hx+4,yH-7,hw-9,1,LT(c));
   if(dir==="left")R(g,hx-4,yH-7,7,4,c);else R(g,cx-3,yH-9,6,2,c);
   sideBurn(G,c,5);R(g,hx+1,yH+2,hw-2,2,"#1a1a1a");if(dir==="down"){R(g,cx-6,yH+2,5,2,"#2a3448");R(g,cx+1,yH+2,5,2,"#2a3448");R(g,cx-5,yH+2,1,1,"#7fc8ff");R(g,cx+2,yH+2,1,1,"#7fc8ff");R(g,cx-1,yH+7,2,2,"#c9c9d6");}}},
 /* Law: QA. White spotted fur hat, yellow hoodie with black sleeves + smiley mark, spotted jeans, long sword on his back, goatee */
 law:{size:"tall",skin:"#e8b98a",bottom:"#d8cfb8",shoes:"#1a1a1a",sleeve:"#1a1a1a",sleeveRows:99,hand:"#e8b98a",
  back(G){if(G.dir==="left")return;const{g,lx,tw,yT,th}=G;line(g,lx-3,yT+th+3,lx+tw+3,yT-7,"#1a1a1a");R(g,lx+tw+2,yT-8,2,2,"#e8e2d0");R(g,lx-4,yT+th+3,2,2,"#7a2e3a");},
  torso(G){const{g,lx,yT,tw,th,cx,dir}=G;R(g,lx,yT,tw,th,"#f2d04a");R(g,lx,yT,tw,2,"#1a1a1a");R(g,lx,yT+th-1,tw,1,"#1a1a1a");
   if(dir==="down"){R(g,cx-2,yT+3,4,1,"#1a1a1a");R(g,cx-2,yT+3,1,3,"#1a1a1a");R(g,cx+1,yT+3,1,3,"#1a1a1a");R(g,cx-2,yT+6,4,1,"#1a1a1a");R(g,cx-1,yT+5,2,1,"#1a1a1a");}
   for(let i=0;i<2;i++)R(g,lx+1+i*(tw-3),yT+th-3,1,1,"#5c3416");},
  hair(G){const{g,hx,hw,hh,yH,dir,cx}=G,c="#1a1a1a";
   if(dir==="up")backHair(G,c);else{sideBurn(G,c,8);if(dir==="down")R(g,cx-1,yH+hh-2,2,2,c);else R(g,hx,yH+hh-2,2,2,c);}
   const y=yH-4;R(g,hx-1,y,hw+2,7,"#f4f0e4");R(g,hx,y-2,hw,2,"#f4f0e4");R(g,hx+2,y-3,hw-4,1,"#f4f0e4");R(g,hx-1,y+5,hw+2,2,"#d9d0bc");
   [[2,-1],[6,1],[10,-2],[3,3],[11,2],[8,4]].forEach(([dx,dy])=>{if(dx<hw-1)R(g,hx+dx,y+dy,2,1,"#6b4a2a");});}}
};
Object.values(LOOKS).forEach(L=>{const S=SZ[L.size];L.ht=S.leg+S.th+S.hh+2;L.tall=L.size==="tall";L.short=L.size==="short";});
function drawBody(g,id,cx,y,dir,t,walking,noHat,emoteFace){const L=LOOKS[id],S=SZ[L.size];
  const f=walking?Math.floor(t/130)%4:0,bob=(walking&&(f===1||f===3))?-1:0,breathe=(!walking&&Math.floor((t+cx*37)/1100)%2)?1:0;
  const yL=y-S.leg,yT=yL-S.th+bob,yH=yT-S.hh+1+bob*0-0+(breathe?0:0),lx=cx-(S.tw>>1),hx=cx-(S.hw>>1);
  const G={g,cx,y,dir,f,t,walking,legH:S.leg,th:S.th,tw:S.tw,hw:S.hw,hh:S.hh,yL,yT,yH:yH+(breathe?0:0),lx,hx,L,noHat,id};
  costume(g,id,"back",dir,G);if(L.back&&dir!=="up")L.back(G);if(L.back&&dir==="up"&&id==="brook")L.back(G);
  legs(G);if(L.torso)L.torso(G);else R(g,lx,yT,S.tw,S.th,L.top);arms(G);
  if(L.head)L.head(G);else{R(g,hx+1,yH,S.hw-2,S.hh,L.skin);R(g,hx,yH+1,S.hw,S.hh-2,L.skin);R(g,hx+2,yH+S.hh-1,S.hw-4,1,DK(L.skin));if(dir==="left")R(g,hx+S.hw-5,yH+6,2,3,DK(L.skin));}
  if(dir!=="up"){if(L.face)L.face(G);else face(G,emoteFace);}
  L.hair(G);costume(g,id,"front",dir,G);}
function face(G,ef){const{g,cx,yH,hh,hx,dir,t,id}=G,ey=yH+Math.round(hh*0.5),blink=Math.floor((t+id.length*913)/110)%42===0||ef==="sleep";
  const eye=(x)=>{if(blink)R(g,x,ey+1,2,1,"#1a1a1a");else if(ef==="happy"){R(g,x,ey,2,1,"#1a1a1a");R(g,x-1,ey+1,1,1,"#1a1a1a");R(g,x+2,ey+1,1,1,"#1a1a1a");}else{R(g,x,ey,2,2,"#1a1a1a");R(g,x,ey,1,1,"#fff");}};
  if(dir==="down"){eye(cx-4);eye(cx+2);R(g,cx-1,ey+3,2,1,ef==="happy"?"#c8323c":"#8a3a2a");if(ef==="happy")R(g,cx-1,ey+4,2,1,"#c8323c");R(g,cx-6,ey+2,2,1,"rgba(240,120,120,.55)");R(g,cx+4,ey+2,2,1,"rgba(240,120,120,.55)");}
  else{eye(hx+2);R(g,hx,ey+3,2,1,"#8a3a2a");}}
function legs(G){const{g,cx,y,dir,f,yL,L,legH}=G,lw=L.lw||3,top=L.bottom,skin=L.legSkin||L.skin;
  const leg=(x,lift,w,dark)=>{const bot=y-1-lift;for(let r=yL;r<bot;r++){const k=r-yL;let c=top;if(L.shorts!=null&&k>=L.shorts)c=skin;if(L.cuff&&k===L.shorts)c=L.cuff;R(g,x,r,w,1,dark?DK(c):c);}R(g,x-(dir==="left"?1:0),bot,w+(dir==="left"?1:0),1,dark?DK(L.shoes):L.shoes);};
  if(dir==="left"){if(f===1){leg(cx+1,1,lw,true);leg(cx-3,0,lw);}else if(f===3){leg(cx-3,1,lw,true);leg(cx+1,0,lw);}else{leg(cx-1,0,lw,true);leg(cx-2,0,lw);}}
  else{const gap=L.size==="wide"?2:1;leg(cx-gap-lw+1,f===1?1:0,lw);leg(cx+gap,f===3?1:0,lw);}}
function arms(G){const{g,lx,tw,yT,th,dir,f,L,cx}=G,len=Math.max(4,th-1),sl=L.sleeve||L.skin,rows=L.sleeve?(L.sleeveRows||99):0,hand=L.hand||L.skin,aw=L.size==="wide"?3:2;
  const arm=(x,dy,dx)=>{for(let r=0;r<len;r++){const xx=x+Math.round(dx*r/len);R(g,xx,yT+1+r+dy,aw,1,r<rows?sl:L.skin);}R(g,x+dx,yT+len+dy,aw,2,hand);};
  if(dir==="left")arm(cx-1,0,f===1?-2:f===3?2:0);else{arm(lx-aw,f===1?1:0,0);arm(lx+tw,f===3?1:0,0);}}
/* actor = outlined sprite + soft shadow; "right" is the mirrored "left" view */
const BW=44,BH=56,BX=22,BY=52;
const offA=mk(BW,BH),offS=mk(BW,BH),ogA=offA.getContext("2d"),ogS=offS.getContext("2d");
function drawActor(c,id,x,y,t,walking,dir,shadow=true,noHat=false,ef){x=Math.round(x);y=Math.round(y);
  if(shadow)oval(c,x,y,7,2,"rgba(0,0,0,.28)");
  ogA.clearRect(0,0,BW,BH);drawBody(ogA,id,BX,BY,dir==="right"?"left":dir,t,walking,noHat,ef);
  ogS.clearRect(0,0,BW,BH);ogS.globalCompositeOperation="source-over";ogS.drawImage(offA,0,0);ogS.globalCompositeOperation="source-in";R(ogS,0,0,BW,BH,OUTL);ogS.globalCompositeOperation="source-over";
  c.save();if(dir==="right"){c.translate(x*2,0);c.scale(-1,1);}
  for(const[dx,dy]of[[-1,0],[1,0],[0,-1],[0,1]])c.drawImage(offS,x-BX+dx,y-BY+dy);c.drawImage(offA,x-BX,y-BY);c.restore();}
function drawChibi(g,id,x,y,t,walking,dir){if(dir==="right"){const tmp=mk(BW,BH,q=>drawBody(q,id,BX,BY,"left",t,walking));g.save();g.translate(x,0);g.scale(-1,1);g.drawImage(tmp,-BX,y-BY);g.restore();}else drawBody(g,id,x,y,dir||"down",t,walking);}
/* ================= SPOTS + ROUTING (rooms connect through doors to the hall/deck) ================= */
const SPOTS={
  helm:{x:330,y:150,label:"at the helm",dir:"up"}, board:{x:320,y:104,label:"reading the notice board",dir:"up"}, maptable:{x:450,y:240,label:"at the map table"},
  grove:{x:470,y:132,label:"by the tangerine grove"}, bowdeck:{x:520,y:214,label:"on the bow deck"}, lion:{x:578,y:200,label:"by the lion figurehead",dir:"right"}, mastfoot:{x:380,y:206,label:"at the foot of the mast"},
  nest:{x:386,y:56,label:"on lookout in the crow's nest"}, nest2:{x:406,y:56,label:"peering through the spyglass",dir:"right"},
  galley:{x:90,y:98,label:"at the galley counter"}, stove:{x:52,y:94,label:"at the stove",dir:"up"},
  library:{x:170,y:122,label:"reading at the library desk"}, shelves:{x:146,y:110,label:"browsing the shelves",dir:"up"},
  dealdesk:{x:258,y:110,label:"at the deal desk"}, dealboard:{x:230,y:96,label:"checking the deal chart",dir:"up"}, meds:{x:282,y:96,label:"at the medicine cabinet",dir:"up"},
  cargo:{x:84,y:272,label:"guarding the cargo hold"}, crates:{x:60,y:276,label:"counting crates",dir:"up"}, chest:{x:108,y:270,label:"checking the treasure chest",dir:"up"}, pallet:{x:66,y:296,label:"checking the pallet"}, vault:{x:108,y:292,label:"guarding the treasure vault"},
  ledger:{x:172,y:266,label:"at the ledger desk"}, aquarium:{x:258,y:252,label:"by the aquarium",dir:"up"},
  b1:{x:246,y:270,label:"on break in the lounge"}, b2:{x:270,y:270,label:"on break in the lounge"}, b3:{x:246,y:302,label:"on break in the lounge",dir:"up"}, b4:{x:270,y:302,label:"on break in the lounge",dir:"up"}, b5:{x:240,y:258,label:"at the aquarium bar",dir:"left"}, b6:{x:288,y:300,label:"on break by the idea board",dir:"up"},
  ideaboard:{x:288,y:274,label:"pinning ideas on the board",dir:"up"},
  rest1:{x:250,y:318,label:"napping on the lounge sofa"}, rest2:{x:278,y:318,label:"resting on the lounge sofa"},
  meal1:{x:66,y:128,label:"eating at the galley table"}, meal2:{x:98,y:128,label:"eating at the galley table"}, meal3:{x:66,y:158,label:"eating at the galley table",dir:"up"}, meal4:{x:98,y:158,label:"eating at the galley table",dir:"up"},
  c1:{x:330,y:252,label:"hanging out on deck",dir:"right"}, c2:{x:354,y:252,label:"hanging out on deck",dir:"left"},
  m0:{x:396,y:226,label:"leading the crew meeting"},
  workbench:{x:536,y:294,label:"at the shipwright's workbench",dir:"up"}, blueprints:{x:500,y:300,label:"checking the blueprints",dir:"up"},
  qadesk:{x:528,y:128,label:"running QA tests",dir:"up"}, qanotes:{x:556,y:132,label:"writing up a bug report",dir:"up"}
};
[[350,214],[344,236],[356,258],[442,214],[448,236],[436,258],[380,272],[412,272],[352,280],[440,280]].forEach(([x,y],i)=>SPOTS["m"+(i+1)]={x,y,label:"at the crew meeting by the mast"});
const BREAK_SPOTS=["b1","b2","b3","b4","b5","b6"];
const AG={
  luffy:{home:"helm",visits:["board","maptable","bowdeck","lion","galley","vault","nest2","aquarium"]},
  chopper:{home:"dealdesk",visits:["dealboard","meds","library","galley"]},
  nami:{home:"maptable",visits:["grove","board","helm","library","vault"]},
  robin:{home:"library",visits:["shelves","aquarium","dealboard","maptable"]},
  usopp:{home:"nest",visits:["nest2","lion","board","bowdeck","nest2"]},
  sanji:{home:"galley",visits:["stove","maptable","dealboard","chest","grove"]},
  jinbe:{home:"ledger",visits:["vault","pallet","board","library","aquarium"]},
  zoro:{home:"cargo",visits:["crates","pallet","chest","mastfoot","bowdeck","vault"]},
  brook:{home:"bowdeck",visits:["lion","grove","mastfoot","galley","aquarium"]},
  frankie:{home:"workbench",visits:["blueprints","lion","bowdeck","mastfoot","galley","aquarium"]},
  law:{home:"qadesk",visits:["qanotes","meds","dealboard","library","board","bowdeck"]}};
const agents=STATUS.agents.filter(a=>LOOKS[a.id]).map(a=>{const cfg=AG[a.id]||{home:"helm",visits:["board"]},h=SPOTS[cfg.home];return Object.assign({},a,cfg,{x:h.x,y:h.y,path:[],dir:h.dir||"down",walking:false,wait:2500+Math.random()*7000,at:cfg.home,state:String(a.state||"").trim().toLowerCase() /* v4.1: no default "working"; blank shows as resting */,decision:a.decision||null});});
function routeTo(a,spot){const s=SPOTS[spot];if(!s)return;const pts=[];let cur={x:a.x,y:a.y},ca=areaOf(cur);const ta=areaOf(s);
  const cross=q=>{if((cur.x<300)!==(q.x<300)){const hm={x:306,y:Math.max(176,Math.min(212,cur.x<300?cur.y:q.y))};pts.push(hm);cur=hm;}};
  if(ca!==ta){if(ca==="nest"){pts.push({x:MAST.x,y:56},{x:MAST.x,y:MAST.base+12});cur=pts[pts.length-1];}else if(ca!=="open"){const d=DOORS[ca];pts.push(d.in,d.out);cur=d.out;}
    if(ta==="nest"){const mf={x:MAST.x,y:MAST.base+12};cross(mf);pts.push(mf,{x:MAST.x,y:56});}else if(ta!=="open"){const d=DOORS[ta];cross(d.out);pts.push(d.out,d.in);}else cross(s);}
  else if(ta==="open")cross(s);
  pts.push({x:s.x,y:s.y});a.path=pts;a.at=null;a.target=spot;}
const climbing=a=>Math.abs(a.x-MAST.x)<2&&a.y<MAST.base+4&&a.y>58;
function updateAgent(a,dt){
  if(a.path.length){const p=a.path[0],dx=p.x-a.x,dy=p.y-a.y,d=Math.hypot(dx,dy),sp=(climbing(a)?18:32)*(a.fast?2.2:1)*dt/1000;a.walking=true;
    if(d<=sp){a.x=p.x;a.y=p.y;a.path.shift();if(a.redirect){const r=a.redirect;a.redirect=null;routeTo(a,r.spot);a.onArrive=r.cb||null;return;}
      if(!a.path.length){a.walking=false;a.fast=false;a.at=a.target;a.wait=a.at===a.home?9000+Math.random()*10000:3500+Math.random()*3500;a.dir=(SPOTS[a.at]&&SPOTS[a.at].dir)||"down";if(a.onArrive){const f=a.onArrive;a.onArrive=null;f(a);}}}
    else{a.x+=dx/d*sp;a.y+=dy/d*sp;a.dir=climbing(a)?"up":Math.abs(dx)>Math.abs(dy)?(dx<0?"left":"right"):(dy<0?"up":"down");}
  } else { a.wait-=dt; if(a.wait<=0){ const n=chooseNext(a); if(n===false){a.wait=1500;return;} routeTo(a, n || (a.at===a.home? a.visits[Math.floor(Math.random()*a.visits.length)] : a.home)); } }
}
/* interrupt-safe routing: re-plans at the next node if the agent is mid-walk */
function goTo(a,spot,cb,fast){if(!SPOTS[spot])return;a.fast=!!fast;if(!a.path.length){routeTo(a,spot);a.onArrive=cb||null;}else a.redirect={spot,cb};}
/* v4.1 (Law D.4 #5): recency gate. The same line from the same bot at most once per 15 min, from any bot at most once per 10 min; otherwise it stays silent.
   Meeting lines (read from the BRIEFING / SUMMARIES tabs) and real event lines pass with {force:true}. */
const SAID=new Map();
function say(a,text,ms=4000,opt){if(!a||!text)return false;const now=performance.now(),t=String(text),k1=a.id+"|"+t,k0="*|"+t;
  if(!(opt&&opt.force)){if(now-(SAID.get(k1)??-1e9)<15*60e3||now-(SAID.get(k0)??-1e9)<10*60e3)return false;}
  SAID.set(k1,now);SAID.set(k0,now);if(SAID.size>400){const old=[...SAID.entries()].sort((x,y)=>x[1]-y[1]).slice(0,100);old.forEach(([k])=>SAID.delete(k));}
  a.say={text:t,until:now+ms};return true;}
function emote(a,k,ms=2200){a.emote={k,until:performance.now()+ms,t0:performance.now()};}
