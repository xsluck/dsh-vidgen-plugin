globalThis.__arg = process.argv[2] || ''
;(async () => {
const fs=require("fs"),os=require("os"),path=require("path");
const home=process.env.HOME||os.homedir()||"";
const dshHome=process.env.DSH_HOME||path.join(home,".dsh");
const docArg=(globalThis.__arg||"").trim();
const out={
  video:{activeId:"",providers:[]},
  image:{activeId:"",providers:[]},
  user:null,src:"",diag:{home:dshHome,cwd:process.cwd(),arg:docArg,files:{},parse:""}
};
const strip=(s)=>{let v=String(s).trim();if((v[0]==='"'&&v.slice(-1)==='"')||(v[0]==="'"&&v.slice(-1)==="'"))v=v.slice(1,-1);return v};
// ── 1. 用户文件(v3: {active,providers:{}} / v2: {apiUrl..} / v1: 扁平) ──
const userCandidates=[path.join(dshHome,"vidgen-config.json"),path.join(os.tmpdir(),"vidgen-config.json")];
let userData=null,userPath="";
for(const uf of userCandidates){
  if(fs.existsSync(uf)){
    try{
      const j=JSON.parse(fs.readFileSync(uf,"utf8"));
      if(j&&(j.video||j.image||j.apiKey)){ userData=j; userPath=uf; break; }
    }catch(e){}
  }
}
const normSeg=(seg)=>{
  if(!seg) return {activeId:"",providers:[]};
  if(seg.providers&&typeof seg.providers==="object"){
    const list=[];
    for(const id of Object.keys(seg.providers)){
      const p=seg.providers[id];
      if(p&&p.apiKey) list.push({id,name:String(p.name||id),apiUrl:String(p.apiUrl||"").trim(),apiKey:String(p.apiKey).trim(),model:String(p.model||"").trim(),source:"user-file"});
    }
    return {activeId:String(seg.active||""),providers:list};
  }
  if(seg.apiKey) return {activeId:"default",providers:[{id:"default",name:"默认",apiUrl:String(seg.apiUrl||"").trim(),apiKey:String(seg.apiKey).trim(),model:String(seg.model||"").trim(),source:"user-file"}]};
  return {activeId:"",providers:[]};
};
let segVideo={activeId:"",providers:[]},segImage={activeId:"",providers:[]};
if(userData){
  if(userData.video&&(userData.video.providers||userData.video.apiKey)) segVideo=normSeg(userData.video);
  else if(userData.apiKey&&!userData.video) segVideo=normSeg({active:"default",providers:{default:{name:"默认",apiUrl:userData.apiUrl,apiKey:userData.apiKey,model:userData.model}}});
  if(userData.image&&(userData.image.providers||userData.image.apiKey)) segImage=normSeg(userData.image);
  out.user={path:userPath,exists:true};
}
// ── 2. settings.yaml(dsh-video / dsh-imagegen 段) 与 draw-config.json → 系统兜底 provider ──
let sysVideo={apiUrl:"",apiKey:"",model:"",src:""},sysImage={apiUrl:"",apiKey:"",model:"",src:""};
try{
  const targets=[docArg,path.join(dshHome,"settings.yaml"),path.join(home,".dsh","settings.yaml")].filter(Boolean).filter((v,i,a)=>a.indexOf(v)===i);
  for(const p of targets){
    out.diag.files[p]="missing";
    try{
      if(fs.existsSync(p)){
        let inSec="";let foundSec="";
        for(const raw0 of fs.readFileSync(p,"utf8").split(String.fromCharCode(10))){
          let line=raw0;
          if(line.length>0&&line.charCodeAt(line.length-1)===13)line=line.slice(0,-1);
          if(line.startsWith(" ")){
            if(inSec){
              const ci=line.indexOf(":");
              if(ci>0){
                const k=line.slice(0,ci).trim();
                const v=strip(line.slice(ci+1).trim());
                if(/^(apiUrl|baseURL|baseUrl|apiKey|api_key|model)$/.exec(k)){
                  if(/api_?key/i.test(k)){ if(inSec==="video"){if(!sysVideo.apiKey&&v){sysVideo.apiKey=v;sysVideo.src="settings.yaml";}} if(inSec==="image"){if(!sysImage.apiKey&&v){sysImage.apiKey=v;sysImage.src="settings.yaml";}} }
                  else if(/model/i.test(k)){ if(inSec==="video"&&!sysVideo.model)sysVideo.model=v; if(inSec==="image"&&!sysImage.model)sysImage.model=v; }
                  else { if(inSec==="video"&&!sysVideo.apiUrl&&v)sysVideo.apiUrl=v; if(inSec==="image"&&!sysImage.apiUrl&&v)sysImage.apiUrl=v; }
                }
              }
            }
          }else{
            if(line==="dsh-video:"){inSec="video";foundSec="dsh-video";}
            else if(line==="dsh-imagegen:"){inSec="image";foundSec=foundSec||"dsh-imagegen";}
            else inSec="";
          }
        }
        if(foundSec){out.diag.files[p]="parsed:"+foundSec; if(!out.src)out.src=p;}
        else out.diag.files[p]="exists-no-sec";
      }
    }catch(e){ out.diag.files[p]="read-error:"+String(e&&e.message||e); }
  }
}catch(e){ out.diag.parse="try1:"+String(e&&e.message||e); }
try{
  const dd=[];
  if(home)dd.push(path.join(home,"svnlocal","DeepSeek-Harness","dsh-draw-router","draw-config.json"));
  dd.push(path.join(dshHome,"draw-config.json"));
  dd.push(path.join(process.cwd(),"dsh-draw-router","draw-config.json"));
  for(const c of dd){
    out.diag.files[c]="missing";
    try{
      if(fs.existsSync(c)){
        const j=JSON.parse(fs.readFileSync(c,"utf8"));
        const s=j&&j.sources&&(j.sources["Agnes-AI"]||j.sources["Agnes"]||j.sources["agnes"]);
        if(s&&s.apiKey){
          const bu=s.baseUrl||s.baseURL||"https://apihub.agnes-ai.com/v1";
          if(!sysVideo.apiKey){sysVideo.apiKey=String(s.apiKey);sysVideo.apiUrl=bu;sysVideo.src="draw-config.json";}
          if(!sysImage.apiKey){sysImage.apiKey=String(s.apiKey);sysImage.apiUrl=bu;sysImage.src="draw-config.json";}
          out.diag.files[c]="parsed-agnes";
          break;
        }
        out.diag.files[c]="exists-no-agnes";
      }
    }catch(e){ out.diag.files[c]="read-error:"+String(e&&e.message||e); }
  }
}catch(e){ out.diag.parse="try2:"+String(e&&e.message||e); }
// ── 3. 规范化:无用户 provider 时用系统兜底;active 非法时回退首个 ──
const canon=(seg,sys)=>{
  let list=seg.providers.filter(p=>p.apiKey&&p.id);
  if(!list.length&&sys.apiKey) list=[{id:"sys",name:"系统兜底",apiUrl:sys.apiUrl,apiKey:sys.apiKey,model:sys.model,source:sys.src||"settings/draw-config",sys:true}];
  let activeId=(seg.activeId&&list.some(p=>p.id===seg.activeId))?seg.activeId:(list.length?list[0].id:"");
  return {activeId:activeId,providers:list};
};
out.video=canon(segVideo,sysVideo);
out.image=canon(segImage,sysImage);
process.stdout.write(JSON.stringify(out));
})()