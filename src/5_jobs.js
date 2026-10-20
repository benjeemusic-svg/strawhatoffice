/* v4.1: Bounty Board removed (owner 20:31): no job form, no job list, no bot walking to the board to "accept" a job
   (that was simulated work). The JOBS tab is still synced but nothing in the UI shows it. Only the shared helpers stay. */
const short=(s,n=34)=>{s=String(s||"");return s.length>n?s.slice(0,n-1)+"…":s;};
const nameOf=id=>{const a=agents.find(x=>x.id===id);return a?a.name:id||"anyone";};
const safeLink=u=>/^https?:\/\//i.test(String(u||""))?String(u):null; // used by the message-in-a-bottle news link (5_world.js)
