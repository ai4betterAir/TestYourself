export const YEARS=['K','1','2','3','4','5','6'];
export const SUBJECTS=['Maths','English','Science'];
export function progress(state){
  let answered=0,correct=0;
  state.checked.forEach((checked,i)=>{if(checked){answered++;if(state.answers[i]===state.questions[i].answer)correct++;}});
  return {answered,correct,total:state.questions.length,complete:answered===state.questions.length};
}
export function validSession(row,owner){
  if(!row||row.student_id!==owner||!YEARS.includes(row.year_level)||!SUBJECTS.includes(row.subject))return false;
  const s=row.state,n=s?.questions?.length;
  if(![10,20].includes(n)||!Array.isArray(s.answers)||!Array.isArray(s.checked)||s.answers.length!==n||s.checked.length!==n||!Number.isInteger(s.cursor)||s.cursor<0||s.cursor>=n)return false;
  return s.questions.every((q,i)=>typeof q.text==='string'&&Array.isArray(q.choices)&&q.choices.length>=2&&q.choices.every(c=>typeof c==='string')&&Number.isInteger(q.answer)&&q.answer>=0&&q.answer<q.choices.length&&(s.answers[i]===null||Number.isInteger(s.answers[i])&&s.answers[i]>=0&&s.answers[i]<q.choices.length)&&typeof s.checked[i]==='boolean'&&(!s.checked[i]||s.answers[i]!==null));
}
export function newSession(id,owner,year,subject,topics,labels,questions){
  const row={id,student_id:owner,year_level:year,subject,topic_ids:topics,topic_labels:labels,version:0,updated_at:new Date().toISOString(),unsynced:true,state:{questions,answers:Array(questions.length).fill(null),checked:Array(questions.length).fill(false),cursor:0}};
  if(!validSession(row,owner))throw new Error('Could not prepare this practice session.');
  return row;
}
export function choose(row,index){const s=row.state;if(!s.checked[s.cursor]&&Number.isInteger(index)&&index>=0&&index<s.questions[s.cursor].choices.length)s.answers[s.cursor]=index;}
export function check(row){const s=row.state;if(s.answers[s.cursor]===null)return false;s.checked[s.cursor]=true;return true;}
export function move(row,index){if(Number.isInteger(index)&&index>=0&&index<row.state.questions.length)row.state.cursor=index;}
export function label(row){return row.topic_labels?.length===1?row.topic_labels[0]:'Mixed '+row.subject+' topics';}
