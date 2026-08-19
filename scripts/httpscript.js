globalThis.__arg = process.argv[2] || ''
;(async()=>{
const q=JSON.parse(Buffer.from(globalThis.__arg,"base64").toString("utf8"));
let r;
try{r=await fetch(q.url,{method:q.method||"GET",headers:q.headers||{},body:q.body})}catch(e){process.stdout.write(JSON.stringify({netErr:String(e&&e.message||e)}));process.exit(1)}
const t=await r.text();
process.stdout.write(JSON.stringify({status:r.status,text:t}));
})()