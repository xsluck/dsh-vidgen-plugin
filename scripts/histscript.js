globalThis.__arg = process.argv[2] || ''
;(async () => {
const fs=require("fs"),os=require("os"),path=require("path");
const home=process.env.HOME||os.homedir()||"";
const dshHome=process.env.DSH_HOME||path.join(home,".dsh");
const targets=[path.join(dshHome,"vidgen-history.json"),path.join(os.tmpdir(),"vidgen-history.json")];
const arg=globalThis.__arg||"";
if(arg && arg!=="read"){
  const out={ok:false,files:[],error:""};
  try{
    const data=arg;
    for(const f of targets){
      try{
        const dir=path.dirname(f);
        if(!fs.existsSync(dir)) fs.mkdirSync(dir,{recursive:true});
        fs.writeFileSync(f,data,"utf8");
        out.files.push(f);
      }catch(e){ out.error=String(e&&e.message||e); }
    }
    out.ok=out.files.length>0;
  }catch(e){ out.error=String(e&&e.message||e); }
  process.stdout.write(JSON.stringify(out));
}else{
  const out={items:[],file:""};
  try{
    for(const f of targets){
      if(fs.existsSync(f)){
        try{
          const j=JSON.parse(fs.readFileSync(f,"utf8"));
          if(j&&Array.isArray(j.items)){ out.items=j.items; out.file=f; break; }
        }catch(e){}
      }
    }
  }catch(e){}
  process.stdout.write(JSON.stringify(out));
}
})()
