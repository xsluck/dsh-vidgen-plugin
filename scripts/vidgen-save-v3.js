globalThis.__arg = process.argv[2] || ''
;(async () => {
const fs=require("fs"),os=require("os"),path=require("path");
const home=process.env.HOME||os.homedir()||"";
const dshHome=process.env.DSH_HOME||path.join(home,".dsh");
const targets=[path.join(dshHome,"vidgen-config.json"),path.join(os.tmpdir(),"vidgen-config.json")];
const out={ok:false,files:[],error:""};
const blankSeg=()=>({active:"",providers:{}});
const normSeg=(seg)=>{
  if(!seg) return blankSeg();
  if(seg.providers&&typeof seg.providers==="object") return {active:String(seg.active||""),providers:seg.providers};
  if(seg.apiKey){ const p={name:"默认",apiUrl:String(seg.apiUrl||"").trim(),apiKey:String(seg.apiKey).trim(),model:String(seg.model||"").trim()}; const o=blankSeg();o.providers.default=p;o.active="default";return o; }
  return blankSeg();
};
try{
  const payload=JSON.parse(globalThis.__arg||"{}");
  const op=payload.op||"save";
  const kind=payload.kind==="image"?"image":"video";
  // 读现有文件(任意版本)→ v3 结构
  let video=blankSeg(),image=blankSeg();
  try{
    for(const f of targets){
      if(fs.existsSync(f)){
        const old=JSON.parse(fs.readFileSync(f,"utf8"));
        if(old&&old.apiKey&&!old.video){ video=normSeg({active:"default",providers:{default:{name:"默认",apiUrl:old.apiUrl,apiKey:old.apiKey,model:old.model}}}); }
        else if(old&&(old.video||old.image)){ video=normSeg(old.video); image=normSeg(old.image); }
        break;
      }
    }
  }catch(e){}
  const seg=kind==="video"?video:image;
  if(op==="save"){
    const provider=payload.provider||{};
    const id=String(provider.id||"").trim()||("p"+Date.now().toString(36));
    const prev=seg.providers[id]||{};
    const apiKey=String(provider.apiKey||"").trim()||String(prev.apiKey||"").trim();
    if(!apiKey){ out.error="API Key 不能为空(未提供新 Key 且该提供者无已保存 Key)"; process.stdout.write(JSON.stringify(out)); return; }
    seg.providers[id]={name:String(provider.name||"").trim()||String(prev.name||"").trim()||"提供者",apiUrl:String(provider.apiUrl||"").trim()||String(prev.apiUrl||"").trim()||"",apiKey:apiKey,model:String(provider.model||"").trim()||String(prev.model||"").trim()||""};
    seg.active=id;
  }else if(op==="remove"){
    const id=String(payload.providerId||"").trim();
    if(!id||!seg.providers[id]){ out.error="提供者不存在: "+(id||"(空)"); process.stdout.write(JSON.stringify(out)); return; }
    delete seg.providers[id];
    if(seg.active===id) seg.active="";
  }else if(op==="set"){
    const id=String(payload.providerId||"").trim();
    if(!id||!seg.providers[id]){ out.error="提供者不存在: "+(id||"(空)"); process.stdout.write(JSON.stringify(out)); return; }
    seg.active=id;
  }else if(op==="clear"){
    for(const f of targets){
      try{ if(fs.existsSync(f)){ fs.unlinkSync(f); out.files.push(f);} }catch(e){ out.error=String(e&&e.message||e); }
    }
    out.ok=true;
    process.stdout.write(JSON.stringify(out));
    return;
  }else{
    out.error="未知操作: "+op; process.stdout.write(JSON.stringify(out)); return;
  }
  const raw=JSON.stringify({video:video,image:image},null,2)+"\n";
  for(const f of targets){
    try{
      const dir=path.dirname(f);
      if(!fs.existsSync(dir)) fs.mkdirSync(dir,{recursive:true});
      fs.writeFileSync(f,raw,"utf8");
      out.files.push(f);
    }catch(e){ out.error=String(e&&e.message||e); }
  }
  out.ok=out.files.length>0;
}catch(e){ out.error=String(e&&e.message||e); }
process.stdout.write(JSON.stringify(out));
})()