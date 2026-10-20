/* ================= UI: modal, banners, toolbar ================= */
let modalCleanup=null;
function openModal(title,content,narrow){closeModal();$("modalTitle").textContent=title;const b=$("modalBody");b.innerHTML="";if(typeof content==="string")b.innerHTML=content;else b.appendChild(content);$("modalCard").classList.toggle("narrow",!!narrow);$("modal").classList.add("show");return b;}
function closeModal(){if(modalCleanup){try{modalCleanup();}catch(e){}modalCleanup=null;}$("modal").classList.remove("show");}
$("modalClose").onclick=closeModal;$("modal").addEventListener("click",e=>{if(e.target.id==="modal")closeModal();});document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal();});
function el(tag,attrs,...kids){const e=document.createElement(tag);if(attrs)for(const[k,v]of Object.entries(attrs)){if(k==="class")e.className=v;else if(k.startsWith("on"))e[k]=v;else if(k==="html")e.innerHTML=v;else e.setAttribute(k,v);}kids.flat().forEach(k=>e.append(k instanceof Node?k:document.createTextNode(String(k))));return e;}
const banners={};
function banner(key,text,ms){let b=banners[key];if(!text){if(b){b.remove();delete banners[key];}return;}
  if(!b){b=el("div",{class:"banner"});$("stage").appendChild(b);banners[key]=b;}v41Num(b,text);const keys=Object.keys(banners);keys.forEach((k,i)=>banners[k].style.top=(12+i*30)+"px");
  if(ms){clearTimeout(b._t);b._t=setTimeout(()=>banner(key,null),ms);}}
document.querySelectorAll("button[data-act]").forEach(b=>b.onclick=()=>{beep(600,.05);({fun:openFun,brain:()=>openBrainstorms(),replay:()=>newPurchase(lastPurchase(),true)})[b.dataset.act]();});
function openFun(){const box=el("div");
  const sec=(title,btns)=>box.append(el("h4",{style:"font-family:PIX;font-size:9px;color:#7a2e1a;margin:10px 0 4px"},title),el("div",{style:"display:flex;flex-wrap:wrap;gap:6px"},btns.map(([l,f,dis])=>{const b=el("button",{class:"btn",onclick:()=>{closeModal();f();}},l);if(dis)b.disabled=true;return b;})));
  box.append(el("div",{class:"note"},"Previews and on-demand triggers. Timed versions run automatically (meeting ~9:00 BRT on weekdays, meals at breakfast/lunch/dinner, MVP ceremony Fridays 16:00 BRT, rare sea events at random)."));
  sec("CREW ROUTINES",[["Morning meeting",()=>startMeeting("morning")],["Friday summary replay",()=>startMeeting("summary"),!latestSummary()],["Weekly MVP ceremony",()=>startMeeting("ceremony")],["Serve a meal (Sanji)",()=>serveMeal("Snack")]]);
  sec("WORK vs BREAK",[["Send 4 crew on break (preview)",()=>previewBreak(true)],["Back to work",()=>previewBreak(false)],["Start a brainstorm now",()=>{if(!startConvo(true))banner("bs","Need crew in the break room first",3000);}],["Open brainstorm board",()=>openBrainstorms()]]);
  sec("TREASURE VAULT",[["Replay last purchase",()=>newPurchase(lastPurchase(),true)]]);
  sec("TIME OF DAY (now: "+dayPhase().label+")",["auto","day","dusk","night"].map(m=>[m.toUpperCase(),()=>{LS.set("timeMode",m);renderWx();}]));
  sec("WEATHER (now: "+wxKind()+")",["auto","clear","partly","cloudy","fog","rain","storm"].map(m=>[m.toUpperCase(),()=>{LS.set("weatherMode",m);renderWx();}]));
  sec("BANTER & COMBOS",[["Zoro vs Sanji",()=>triggerCombo("bicker",true)],["Luffy + Usopp goofing",()=>triggerCombo("goof",true)]]);
  sec("RARE SEA EVENTS",[["Sea King",()=>startWorld("seaking")],["Storm",()=>startWorld("storm")],["Marine ship on horizon",()=>startWorld("marine")],["Message in a bottle"+(newsRows().length?"":" (needs NEWS tab)"),()=>startWorld("bottle"),!newsRows().length]]);
  sec("ALERTS",[["Big-deal fireworks (preview)",()=>{const c=agents.find(a=>a.id==="chopper");playEvent(c,"deal_found",{preview:true,discount:Math.max(20,CONFIG.bigDealPct)});}],["All signature animations",()=>agents.forEach((a,i)=>setTimeout(()=>playEvent(a,a.event.type,{preview:true}),i*350))]]);
  const sOpts=["auto","off","halloween","christmas","carnival","festa_junina"];sec("SEASON (now: "+seasonNow()+")",sOpts.map(s=>[s.toUpperCase(),()=>{CONFIG.season=s;LS.set("season",s);banner("season","Season: "+seasonNow(),2500);}]));
  openModal("EVENTS & PREVIEWS",box);}
$("zoomBtn").onclick=e=>{e.stopPropagation();ZOOM=!ZOOM;fit();if(ZOOM){const s=$("stage");s.scrollLeft=(s.scrollWidth-s.clientWidth)/2;}};
/* collapsible side sections (tap the heading); on phones only COMMISSION + CREW STATUS start open */
document.querySelectorAll("aside>section").forEach((s,i)=>{const h=s.querySelector("h2");if(!h)return;h.setAttribute("role","button");h.tabIndex=0;h.onclick=()=>s.classList.toggle("collapsed");h.onkeydown=e=>{if(e.key==="Enter")s.classList.toggle("collapsed");};if(window.matchMedia("(max-width:640px)").matches&&i>1)s.classList.add("collapsed");});
