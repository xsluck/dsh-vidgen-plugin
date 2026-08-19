(async()=>{
const fs=require("fs");
const os=require("os");
const path=require("path");
const home=process.env.HOME||os.homedir()||"";
const dshHome=process.env.DSH_HOME||path.join(home,".dsh");
const targets=[path.join(dshHome,"vidgen-config.json"),path.join(os.tmpdir(),"vidgen-config.json")];
const out={ok:false,files:[],error:""};
try{
  for(const f of targets){
    try{if(fs.existsSync(f)){fs.unlinkSync(f);out.files.push(f);}}catch(e){out.error=String(e&&e.message||e);}
  }
  out.ok=true;
}catch(e){out.error=String(e&&e.message||e)}
process.stdout.write(JSON.stringify(out));
})()