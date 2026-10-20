/* ================= PIXEL HELPERS ================= */
const W=480,H=270, cv=$("scene"), ctx=cv.getContext("2d"); ctx.imageSmoothingEnabled=false;
const OUTL="#2a160a";
function R(c,x,y,w,h,col){c.fillStyle=col;c.fillRect(x,y,w,h);}
function mk(w,h,fn){const c=document.createElement("canvas");c.width=w;c.height=h;const g=c.getContext("2d");g.imageSmoothingEnabled=false;if(fn)fn(g);return c;}
function disc(c,cx,cy,r,col){for(let y=-r;y<=r;y++){const w=Math.round(Math.sqrt(r*r-y*y));R(c,cx-w,cy+y,w*2+1,1,col);}}
function ring(c,cx,cy,r,col){for(let a=0;a<360;a+=3){R(c,Math.round(cx+Math.cos(a*Math.PI/180)*r),Math.round(cy+Math.sin(a*Math.PI/180)*r),1,1,col);}}
function line(c,x0,y0,x1,y1,col){x0|=0;y0|=0;x1|=0;y1|=0;const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx+dy;c.fillStyle=col;for(;;){c.fillRect(x0,y0,1,1);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx;}if(e2<=dx){e+=dx;y0+=sy;}}}
function silhouette(src,col){return mk(src.width,src.height,g=>{g.drawImage(src,0,0);g.globalCompositeOperation="source-in";g.fillStyle=col;g.fillRect(0,0,src.width,src.height);});}
function outlined(src,col=OUTL){const s=silhouette(src,col);return mk(src.width+2,src.height+2,g=>{g.drawImage(s,0,1);g.drawImage(s,2,1);g.drawImage(s,1,0);g.drawImage(s,1,2);g.drawImage(src,1,1);});}
function lerpC(a,b,t){const p=x=>[1,3,5].map(i=>parseInt(x.substr(i,2),16));const A=p(a),B=p(b);return "rgb("+A.map((v,i)=>Math.round(v+(B[i]-v)*t)).join(",")+")";}

/* ================= SHIP (side view, bow right, cutaway rooms) ================= */
const LY=[25,114,162,200], LINKX={"0-1":243,"1-2":140,"2-3":236};   // feet y per level: crow's nest, lawn deck, upper rooms, lower rooms
const levelOf=y=>y<60?0:y<140?1:y<185?2:3;
const HULL={hi:"#ffd27a",a:"#f2a93b",b:"#e8992f",seam:"#b8661c",dark:"#c9761e"};
const xl=y=>46+Math.round(40*Math.pow((y-116)/120,2)), xr=y=>420-Math.round(80*Math.pow(Math.max(0,(y-116)/120),1.8));

const ship=mk(W,H,g=>{
  // hull body
  for(let y=116;y<=236;y++){const a=xl(y),b=xr(y),row=y-116;let col=(Math.floor(row/6)%2)?HULL.a:HULL.b;if(y>196)col=(Math.floor(row/6)%2)?HULL.dark:"#d07e22";if(row%6===5)col=HULL.seam;
    R(g,a,y,b-a,1,col);if(row%6!==5)for(let x=a+((Math.floor(row/6)*29)%44);x<b;x+=44)R(g,x,y,1,1,HULL.seam);R(g,a-1,y,2,1,OUTL);R(g,b-1,y,2,1,OUTL);}
  R(g,xl(236),236,xr(236)-xl(236),2,OUTL);
  for(let y=116;y<236;y++)R(g,xl(y)+1,y,2,1,"rgba(255,230,160,.35)");
  for(let y=150;y<236;y++)R(g,xr(y)-4,y,3,1,"rgba(120,50,10,.25)");
  // gunwale
  R(g,44,115,378,6,HULL.hi);R(g,44,115,378,1,"#fff0c0");R(g,44,120,378,1,HULL.seam);R(g,43,114,380,1,OUTL);R(g,43,121,380,1,OUTL);R(g,43,114,1,8,OUTL);
  // cutaway openings
  function opening(x0,y0,x1,y1,wall,wall2){R(g,x0-2,y0-2,x1-x0+4,y1-y0+4,OUTL);R(g,x0,y0,x1-x0,y1-y0,wall);for(let x=x0;x<x1;x+=9)R(g,x,y0,1,y1-y0,wall2);}
  opening(58,124,398,162,"#6b4426","#5e3b20");
  opening(72,168,372,200,"#5a3820","#4f311b");
  R(g,58,124,92,38,"#efe0bf");for(let y=124,r=0;y<162;y+=6,r++){R(g,58,y,92,1,"#d9c49a");for(let x=58+(r%2)*4;x<150;x+=8)R(g,x,y,1,6,"#d9c49a");}
  R(g,252,124,146,38,"#bfe0cf");for(let x=252;x<398;x+=9)R(g,x,124,1,38,"#aed2bf");
  R(g,242,168,130,32,"#2f4f5a");for(let x=242;x<372;x+=9)R(g,x,168,1,32,"#284550");
  R(g,58,124,340,3,"rgba(0,0,0,.25)");R(g,72,168,300,3,"rgba(0,0,0,.25)");
  R(g,58,159,340,3,"#8a5a2e");R(g,58,159,340,1,"#a8703a");R(g,72,197,300,3,"#7a4f2a");R(g,72,197,300,1,"#9a6232");
  [[150,124,162],[250,124,162],[240,168,200]].forEach(([x,a,b])=>{R(g,x-2,a,5,b-a,HULL.a);R(g,x-2,a,1,b-a,HULL.hi);R(g,x-3,a,1,b-a,OUTL);R(g,x+3,a,1,b-a,OUTL);});
  R(g,134,114,13,10,"#2a160a");R(g,230,160,13,10,"#2a160a");
  const ladder=(x,a,b)=>{R(g,x-4,a,1,b-a,"#5c3416");R(g,x+4,a,1,b-a,"#5c3416");for(let y=a+2;y<b;y+=4)R(g,x-4,y,9,1,"#8a5527");};
  ladder(140,114,162);ladder(236,160,200);
  // galley decor
  R(g,62,140,22,19,"#3a3a44");R(g,62,140,22,2,"#5a5a66");R(g,65,150,16,7,"#1a1a22");R(g,67,152,12,4,"#e0602a");R(g,67,155,12,1,"#ffd24a");
  disc(g,72,136,4,"#8a8a96");R(g,67,132,11,3,"#b0b0bc");R(g,78,136,4,1,"#5c3416");
  R(g,90,130,40,2,"#8a5527");for(let i=0;i<6;i++){R(g,92+i*6,125+(i%2),4,5-(i%2),["#e0424f","#57c26a","#f5b400","#fff","#9b59b6","#f08a24"][i]);R(g,92+i*6,124+(i%2),4,1,"#c9a26b");}
  [[138,132],[144,134]].forEach(([x,y])=>{R(g,x,y-5,1,4,"#555");disc(g,x,y+1,2,"#555");});
  // library decor
  const bc=["#7a2e3a","#2f4f8a","#b8862a","#3c6b3c","#5b3a7a","#8a4a2a","#2a6b6b","#9a3a5a"];
  [[156,126,36],[196,126,30]].forEach(([sx,sy,w],s)=>{R(g,sx,sy,w,33,"#5c3416");R(g,sx,sy,w,2,"#8a5527");R(g,sx-1,sy,1,33,OUTL);R(g,sx+w,sy,1,33,OUTL);
    for(let r=0;r<3;r++){R(g,sx+2,sy+3+r*10,w-4,8,"#2a160a");for(let i=0;i*4<w-6;i++){const h=5+((i+r+s)%3);R(g,sx+3+i*4,sy+11+r*10-h,3,h,bc[(i+r*3+s)%8]);R(g,sx+3+i*4,sy+12+r*10-h,3,1,"#e9d3a0");}R(g,sx+2,sy+11+r*10,w-4,1,"#8a5527");}});
  disc(g,229,151,5,"#3f6fd1");R(g,226,148,4,3,"#57c26a");R(g,230,152,3,2,"#57c26a");R(g,228,156,3,3,"#5c3416");
  // sick bay / deal desk decor
  R(g,256,128,26,22,"#7a4a22");R(g,258,130,22,8,"#2a3a34");R(g,258,140,22,8,"#2a3a34");
  const bot=["#57c26a","#3fa9f5","#e0424f","#f5b400"];for(let i=0;i<4;i++){R(g,259+i*5,132,3,6,bot[i]);R(g,259+i*5,142,3,6,bot[(i+2)%4]);R(g,260+i*5,131,1,1,"#ddd");R(g,260+i*5,141,1,1,"#ddd");}
  R(g,338,128,30,20,"#7a4a22");R(g,340,130,26,16,"#f3ecd6");for(let i=0;i<5;i++)R(g,343+i*4,143-i*2-(i%2),3,3+i*2+(i%2),"#3c9a4a");R(g,341,131,10,1,"#8b5a2b");
  // cargo hold decor
  const crate=(x,y,s=14)=>{R(g,x,y,s,s,"#b67b3d");R(g,x,y,s,1,"#d9a066");R(g,x,y,1,s,"#7a4a22");R(g,x+s-1,y,1,s,"#7a4a22");R(g,x,y+s-1,s,1,"#7a4a22");for(let i=0;i<s;i++)R(g,x+i,y+i,1,1,"#8a5527");R(g,x-1,y-1,s+2,1,OUTL);};
  crate(78,183);crate(93,183);crate(85,169);
  const barrel=(x,y)=>{R(g,x+1,y,10,15,"#8a5527");R(g,x,y+2,12,11,"#8a5527");R(g,x+2,y,2,15,"#a8703a");R(g,x,y+3,12,1,"#4a4a4a");R(g,x,y+11,12,1,"#4a4a4a");R(g,x+2,y,8,2,"#5c3416");};
  barrel(112,182);barrel(124,184);
  // ledger room: aquarium window + binders
  R(g,247,171,58,24,OUTL);R(g,249,173,54,20,"#2f8fd8");R(g,249,173,54,4,"#5ab8f0");for(let x=251;x<303;x+=7)R(g,x,191-((x*3)%5),2,2+((x*3)%5),"#3c9a4a");R(g,249,192,54,1,"#e9d3a0");
  R(g,340,172,26,25,"#5c3416");for(let r=0;r<2;r++)for(let i=0;i<5;i++)R(g,342+i*5,174+r*11,4,9,["#7a2e3a","#2f4f8a","#b8862a","#3c6b3c","#5b3a7a"][(i+r)%5]);
  // lanterns
  [[104,126],[200,126],[318,126],[160,170],[320,170]].forEach(([x,y])=>{R(g,x,y-2,1,3,"#333");R(g,x-2,y+1,5,6,"#2a2a2a");R(g,x-1,y+2,3,4,"#ffd24a");R(g,x,y+3,1,2,"#fff6b0");});
  // ---- LAWN DECK ----
  R(g,120,94,292,2,HULL.hi);R(g,120,93,292,1,OUTL);R(g,120,96,292,1,HULL.seam);for(let x=122;x<412;x+=10){R(g,x,96,3,8,HULL.a);R(g,x,96,1,8,HULL.hi);R(g,x+3,96,1,8,HULL.seam);}
  // stern cabin with portholes
  R(g,50,64,68,40,HULL.a);for(let y=64;y<104;y+=6)R(g,50,y+5,68,1,HULL.seam);R(g,49,63,70,1,OUTL);R(g,49,63,1,41,OUTL);R(g,118,63,1,41,OUTL);
  R(g,46,58,76,6,"#c8323c");R(g,46,58,76,1,"#ff6b6b");R(g,45,57,78,1,OUTL);R(g,45,64,78,1,OUTL);R(g,45,57,1,8,OUTL);R(g,122,57,1,8,OUTL);
  [[64,80],[84,80]].forEach(([x,y])=>{disc(g,x,y,5,OUTL);disc(g,x,y,4,"#d4a23a");disc(g,x,y,3,"#7fc8ff");R(g,x-1,y-2,1,2,"#fff");});
  R(g,98,84,14,20,OUTL);R(g,99,85,12,19,"#7a4a22");R(g,108,94,2,2,"#ffd24a");
  R(g,116,70,1,4,"#333");R(g,114,74,5,6,"#2a2a2a");R(g,115,75,3,4,"#ffd24a");
  // tangerine grove
  [[268,84],[290,82]].forEach(([x,y])=>{R(g,x-1,y+6,3,14,"#6b3f1c");disc(g,x,y,8,"#2f7a3a");disc(g,x-2,y-2,5,"#3c9a4a");[[-4,1],[3,-3],[4,3],[-1,5],[-5,-3]].forEach(([dx,dy])=>{R(g,x+dx,y+dy,2,2,"#f5961e");R(g,x+dx,y+dy,1,1,"#ffc060");});});
  // lawn
  for(let y=104;y<115;y++)R(g,44,y,378,1,y<106?"#8ee06a":y<112?"#6cc04a":"#4e9a36");R(g,44,103,378,1,"#3c7a2a");
  for(let x=46;x<420;x+=5){R(g,x+((x*7)%3),102,1,2,"#8ee06a");R(g,x+2,106+((x*3)%5),1,1,"#4e9a36");}
  // mast, yards, big sail
  R(g,229,0,8,104,"#7a4a22");R(g,230,0,2,104,"#a8703a");R(g,236,0,1,104,"#4e2f15");R(g,228,0,1,104,OUTL);R(g,237,0,1,104,OUTL);
  for(let y=26;y<=94;y++){const p=(y-26)/68,b=Math.round(Math.sin(p*Math.PI)*5),x0=176-b,x1=290+b;R(g,x0,y,x1-x0,1,"#fbf7ee");R(g,x1-12,y,12,1,"#ece2cf");R(g,x0,y,6,1,"#ece2cf");R(g,x0-1,y,1,1,OUTL);R(g,x1,y,1,1,OUTL);if(y%17===0)R(g,x0+8,y,x1-x0-20,1,"#efe6d4");}
  R(g,170,23,126,4,"#7a4a22");R(g,170,23,126,1,"#a8703a");R(g,169,22,128,1,OUTL);R(g,169,27,128,1,OUTL);
  R(g,172,94,122,3,"#7a4a22");R(g,171,93,124,1,OUTL);R(g,171,97,124,1,OUTL);
  // jolly roger: our own straw-hat skull & crossbones
  const jx=233,jy=62;
  for(let i=-15;i<=15;i++){R(g,jx+i-1,jy+Math.round(i*0.75)+3,3,3,"#1a1a1a");R(g,jx+i-1,jy-Math.round(i*0.75)+3,3,3,"#1a1a1a");}
  [[-16,-9],[16,-9],[-16,15],[16,15]].forEach(([dx,dy])=>{disc(g,jx+dx,jy+dy,2,"#1a1a1a");disc(g,jx+dx+(dx<0?2:-2),jy+dy+(dy<0?-2:2),2,"#1a1a1a");});
  disc(g,jx,jy,10,"#1a1a1a");R(g,jx-6,jy+7,13,6,"#1a1a1a");
  disc(g,jx-4,jy+1,3,"#fbf7ee");disc(g,jx+4,jy+1,3,"#fbf7ee");R(g,jx-1,jy+5,3,2,"#fbf7ee");for(let i=-4;i<=4;i+=2)R(g,jx+i,jy+10,1,2,"#fbf7ee");
  R(g,jx-9,jy-12,19,6,"#f2cc55");R(g,jx-7,jy-14,15,3,"#f2cc55");R(g,jx-6,jy-14,6,1,"#ffe9a0");R(g,jx-9,jy-8,19,2,"#c8323c");R(g,jx-16,jy-6,33,3,"#e3b444");R(g,jx-16,jy-4,33,1,"#b8902f");
  line(g,jx-17,jy-7,jx+17,jy-7,OUTL);line(g,jx-17,jy-3,jx+17,jy-3,OUTL);line(g,jx-10,jy-15,jx+10,jy-15,OUTL);R(g,jx-17,jy-7,1,5,OUTL);R(g,jx+17,jy-7,1,5,OUTL);
  // rope ladder to crow's nest + rigging
  R(g,239,22,1,82,"#8a6a3a");R(g,247,22,1,82,"#8a6a3a");for(let y=24;y<104;y+=4)R(g,239,y,9,1,"#a07d4d");
  line(g,233,2,120,58,"#5a3a20");line(g,233,2,410,104,"#5a3a20");line(g,233,30,172,93,"#5a3a20");line(g,233,30,296,93,"#5a3a20");
  // bow neck + sunflower lion figurehead (original pixel design)
  for(let i=0;i<22;i++){R(g,404+i,120-i,14,6,HULL.a);R(g,404+i,120-i,14,1,HULL.hi);R(g,418+i,120-i,1,6,OUTL);R(g,404+i,125-i,1,1,OUTL);}
  const lx=444,ly=88;
  for(let a=0;a<16;a++){const ang=a/16*Math.PI*2,r2=a%2?19:22;for(let r=12;r<=r2;r++){disc(g,Math.round(lx+Math.cos(ang)*r),Math.round(ly+Math.sin(ang)*r),r<r2-2?3:2,a%2?"#f5961e":"#ffc83a");}}
  for(let a=0;a<16;a++){const ang=a/16*Math.PI*2,r2=a%2?21:24;R(g,Math.round(lx+Math.cos(ang)*r2),Math.round(ly+Math.sin(ang)*r2),1,1,OUTL);}
  disc(g,lx,ly,13,OUTL);disc(g,lx,ly,12,"#ffe39a");disc(g,lx-2,ly-3,6,"#fff0c0");
  R(g,lx-6,ly-3,3,3,OUTL);R(g,lx+4,ly-3,3,3,OUTL);R(g,lx-5,ly-3,1,1,"#fff");R(g,lx+5,ly-3,1,1,"#fff");
  R(g,lx-2,ly+1,5,2,"#8a4a2a");R(g,lx-1,ly+3,3,1,"#8a4a2a");R(g,lx-5,ly+6,11,1,"#8a4a2a");R(g,lx-6,ly+5,1,1,"#8a4a2a");R(g,lx+6,ly+5,1,1,"#8a4a2a");
  line(g,lx-12,ly+2,lx-7,ly+3,"#8a4a2a");line(g,lx+12,ly+2,lx+7,ly+3,"#8a4a2a");R(g,lx-8,ly+2,2,1,"#ffb0a0");R(g,lx+7,ly+2,2,1,"#ffb0a0");
});

/* ================= PROPS (depth-sorted with crew) ================= */
const props=[];
function prop(x,y,w,h,base,fn){props.push({x:x-1,y:y-1,img:outlined(mk(w,h,fn)),base});}
prop(152,92,18,22,115,g=>{R(g,8,12,3,10,"#7a4a22");R(g,5,20,9,2,"#5c3416");ring(g,9,9,7,"#8a5527");ring(g,9,9,6,"#a8703a");for(let a=0;a<8;a++){const an=a*Math.PI/4;line(g,9,9,Math.round(9+Math.cos(an)*8),Math.round(9+Math.sin(an)*8),"#7a4a22");}disc(g,9,9,2,"#d4a23a");});  // helm
prop(120,80,24,26,115,g=>{R(g,3,14,2,12,"#5c3416");R(g,19,14,2,12,"#5c3416");R(g,0,0,24,16,"#7a4a22");R(g,2,2,20,12,"#e9d3a0");R(g,4,4,6,5,"#fff");R(g,12,3,7,6,"#ffe680");R(g,5,10,6,3,"#ffd0dc");R(g,13,10,6,3,"#bfe3ff");R(g,7,4,1,1,"#c8323c");R(g,15,3,1,1,"#c8323c");}); // quest board
prop(178,103,32,12,115,g=>{R(g,0,0,32,4,"#b67b3d");R(g,2,4,3,8,"#7a4a22");R(g,27,4,3,8,"#7a4a22");R(g,3,0,24,3,"#f3dfb0");R(g,6,0,8,2,"#5fb86a");R(g,16,1,7,2,"#5fb86a");R(g,4,1,22,1,"#7fc8ff");R(g,28,0,3,3,"#d4a23a");}); // map table
prop(212,15,40,16,28,g=>{R(g,0,0,40,3,"#5c3416");R(g,0,0,40,1,"#a8703a");for(let y=3;y<16;y++){const ins=y>11?(y-11)*2:0;R(g,1+ins,y,38-ins*2,1,(y%4)?"#8a5527":"#6b3f1c");}for(let x=4;x<38;x+=7)R(g,x,3,1,10,"#5c3416");}); // crow's nest
prop(88,153,44,10,163,g=>{R(g,0,0,44,4,"#d8d2c0");R(g,0,0,44,1,"#fff");R(g,1,4,42,11,"#7a4a22");R(g,3,6,38,1,"#5c3416");R(g,4,1,12,2,"#c08a4e");R(g,5,1,2,1,"#e0424f");R(g,9,1,2,1,"#57c26a");R(g,13,1,2,1,"#f5a03a");R(g,20,0,2,3,"#bbb");R(g,30,1,9,2,"#f3ecd6");R(g,20,8,4,3,"#d4a23a");}); // galley counter
prop(172,153,42,10,163,g=>{R(g,0,0,42,4,"#6b3f1c");R(g,0,0,42,1,"#9a6232");R(g,1,4,40,11,"#4a2e17");R(g,12,0,16,3,"#f3ecd6");R(g,19,0,2,3,"#b8a080");R(g,2,1,8,2,"#7a2e3a");R(g,35,0,3,3,"#f3ecd6");R(g,36,0,1,1,"#ffb347");}); // reading desk
prop(290,138,48,25,163,g=>{R(g,22,0,22,14,"#2a3448");R(g,24,2,18,10,"#0e1a2a");const p=[8,7,8,5,6,6,4,3,4];for(let i=0;i<9;i++)R(g,25+i*2,2+p[i],2,1,"#53d769");R(g,39,3,2,2,"#ffd24a");R(g,31,14,4,2,"#2a3448");
  R(g,0,16,48,4,"#c08a4e");R(g,0,16,48,1,"#e0b07a");R(g,1,20,46,5,"#7a4a22");R(g,4,14,6,2,"#57c26a");R(g,12,15,6,1,"#ddd");}); // deal desk
prop(362,149,32,14,163,g=>{R(g,0,4,32,6,"#7a4a22");R(g,1,1,30,5,"#f2efe6");R(g,2,1,8,4,"#fff");R(g,12,2,19,4,"#7fa8d6");R(g,0,10,2,4,"#5c3416");R(g,30,10,2,4,"#5c3416");}); // cot
prop(206,186,24,15,201,g=>{R(g,1,5,22,10,"#8a5527");R(g,1,5,22,2,"#c08a4e");R(g,1,9,22,2,"#d4a23a");R(g,10,8,4,5,"#d4a23a");const c=["#e0424f","#3f6fd1","#f5b400","#9b59b6","#53a653"];for(let i=0;i<5;i++){const h=3+(i*3)%3;R(g,3+i*4,5-h,3,h+1,c[i]);R(g,4+i*4,6-h,1,1,"#fff");}}); // card-pack chest
prop(290,191,46,10,201,g=>{R(g,0,0,46,4,"#8a5527");R(g,0,0,46,1,"#b67b3d");R(g,1,4,44,11,"#5c3416");R(g,8,0,18,3,"#f3ecd6");R(g,16,0,2,3,"#8b5a2b");for(let i=0;i<3;i++){R(g,9,1+i,6,1,"#8b8070");R(g,19,1+i,6,1,"#8b8070");}R(g,30,0,12,3,"#7a4a22");for(let i=0;i<4;i++)R(g,31+i*3,1,2,1,["#e0424f","#ffd24a","#57c26a","#3fa9f5"][i]);}); // ledger desk
prop(384,98,10,16,115,g=>{R(g,4,6,2,10,"#333");R(g,1,14,8,2,"#333");R(g,0,0,10,6,"#f3ecd6");R(g,2,2,6,1,"#555");R(g,2,4,5,1,"#555");}); // music stand
