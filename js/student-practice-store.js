import {validSession} from './student-practice-model.js';
const storageOrNull=()=>{try{return window.localStorage;}catch{return null;}};
export function practiceStore(client,owner,storage=storageOrNull()){
  const prefix='acorn-practice:'+owner+':',indexKey=prefix+'index';
  const read=id=>{try{const row=JSON.parse(storage?.getItem(prefix+id)||'null');return validSession(row,owner)?row:null;}catch{return null;}};
  const localList=()=>{try{return JSON.parse(storage?.getItem(indexKey)||'[]').map(read).filter(Boolean);}catch{return [];}};
  function write(row){try{if(!storage||!validSession(row,owner))return false;storage.setItem(prefix+row.id,JSON.stringify(row));const ids=[row.id,...JSON.parse(storage.getItem(indexKey)||'[]').filter(id=>id!==row.id)].slice(0,50);storage.setItem(indexKey,JSON.stringify(ids));return true;}catch{return false;}}
  function merge(cloud){const rows=new Map(cloud.filter(r=>validSession(r,owner)).map(r=>[r.id,r]));for(const local of localList()){const remote=rows.get(local.id);if(!remote||local.unsynced&&local.version>=remote.version)rows.set(local.id,local);}return [...rows.values()].sort((a,b)=>String(b.updated_at).localeCompare(String(a.updated_at)));}
  async function list(){try{const {data,error}=await client.from('student_practice_sessions').select('*').eq('student_id',owner).order('updated_at',{ascending:false}).limit(50);if(error)throw error;return {rows:merge(data||[]),cloud:true};}catch{return {rows:merge([]),cloud:false};}}
  async function load(id){let cloud=null;try{const {data,error}=await client.from('student_practice_sessions').select('*').eq('id',id).eq('student_id',owner).maybeSingle();if(!error&&validSession(data,owner))cloud=data;}catch{}const local=read(id);return local&&(!cloud||local.unsynced&&local.version>=cloud.version)?local:cloud;}
  async function save(row){
    const {data,error}=await client.rpc('save_student_practice',{session_input:row.id,year_input:row.year_level,subject_input:row.subject,topics_input:row.topic_ids,labels_input:row.topic_labels,state_input:row.state,version_input:row.version});
    if(error)throw error;return data;
  }
  return {write,list,load,save};
}
