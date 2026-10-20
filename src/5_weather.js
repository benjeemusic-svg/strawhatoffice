/* ================= WEATHER (live São Paulo weather from Open-Meteo, no key) ================= */
const WEATHER={ok:false,kind:"clear",temp:null,wind:0,code:null,label:"weather unavailable"};
const WX_KIND=c=>c==null?"clear":c===0?"clear":c<=2?"partly":c===3?"cloudy":c<=48?"fog":c<=57?"drizzle":c<=67||(c>=80&&c<=82)?"rain":c<=77||c<=86?"rain":"storm";
const WX_ICON={clear:"☀",partly:"⛅",cloudy:"☁",fog:"🌫",drizzle:"🌦",rain:"🌧",storm:"⛈"};
async function loadWeather(){try{const r=await fetch("https://api.open-meteo.com/v1/forecast?latitude=-23.55&longitude=-46.63&current=weather_code,temperature_2m,wind_speed_10m&timezone=America%2FSao_Paulo");if(!r.ok)throw 0;const j=await r.json(),c=j.current;
  Object.assign(WEATHER,{ok:true,code:c.weather_code,temp:c.temperature_2m,wind:c.wind_speed_10m,kind:WX_KIND(c.weather_code)});}catch(e){WEATHER.ok=false;}renderWx();}
function wxKind(){const m=LS.get("weatherMode","auto");return m==="auto"?WEATHER.kind:m;}
function renderWx(){const k=wxKind(),m=LS.get("weatherMode","auto"),P=dayPhase();let s=WX_ICON[k]+" ";
  s+=m!=="auto"?k+" (preview)":WEATHER.ok?`São Paulo ${Math.round(WEATHER.temp)}°C · ${k} · Open-Meteo live`:"weather unavailable (offline): clear skies";$("wxChip").textContent=s+" · "+P.label;}
HOOK.boot.push(()=>{loadWeather();setInterval(loadWeather,15*60*1000);setInterval(renderWx,30000);});
const cloudsW=Array.from({length:9},()=>({x:Math.random()*W,y:Math.random()*H,r:30+Math.random()*40,v:4+Math.random()*6}));
const rain=Array.from({length:240},()=>({x:Math.random()*W,y:Math.random()*H,v:220+Math.random()*120}));
let flashT=0;
HOOK.tick.push(dt=>{const k=wxKind();if(k==="storm")WORLD.bobAmp=3.5;});
HOOK.sea.push(t=>{const k=wxKind(),n={clear:0,partly:3,cloudy:7,fog:5,drizzle:7,rain:8,storm:9}[k]||0;
  cloudsW.slice(0,n).forEach(c=>{c.x+=c.v*0.016;if(c.x-c.r>W)c.x=-c.r;ctx.fillStyle=k==="storm"?"rgba(10,15,35,.16)":"rgba(10,20,40,.10)";ctx.beginPath();ctx.ellipse(c.x,c.y,c.r,c.r*.55,0,0,7);ctx.fill();});
  if(k==="cloudy"||k==="rain"||k==="storm"||k==="drizzle"){ctx.fillStyle=k==="storm"?"rgba(20,26,50,.28)":"rgba(40,50,70,.14)";ctx.fillRect(0,0,W,H);}
  const drops={drizzle:70,rain:150,storm:240}[k]||0,wind=(WEATHER.wind||10)/10;
  if(drops){ctx.fillStyle="rgba(200,220,255,.55)";rain.slice(0,drops).forEach(d=>{d.y+=d.v*0.016;d.x+=wind*0.6;if(d.y>H){d.y=-6;d.x=Math.random()*W;}if(d.x>W)d.x=0;ctx.fillRect(d.x|0,d.y|0,1,k==="drizzle"?3:5);});
    for(let i=0;i<drops/12;i++){const x=(i*97+Math.floor(t/300)*31)%W,y=(i*61+Math.floor(t/300)*17)%H,q=(t/300)%1;ctx.strokeStyle=`rgba(220,235,255,${(.5*(1-q)).toFixed(2)})`;ctx.beginPath();ctx.ellipse(x,y,1+q*3,(1+q*3)/2,0,0,7);ctx.stroke();}}
  if(k==="fog"){ctx.fillStyle="rgba(230,236,240,.28)";ctx.fillRect(0,0,W,H);for(let i=0;i<4;i++){ctx.fillStyle="rgba(240,244,248,.18)";ctx.fillRect(((t/60+i*170)%(W+200))-200,40+i*80,200,26);}}
  if(k==="storm"){if(t>flashT&&Math.random()<.004){flashT=t+180;beep(70,.3,"sawtooth");}if(t<flashT){ctx.fillStyle="rgba(255,255,255,.45)";ctx.fillRect(0,0,W,H);}}});
