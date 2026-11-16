// Shared by the dashboard and homework form; seeding is idempotent in the database.
let pending;
export function ensureTeacherGroups(client) {
  if (!pending) pending=client.rpc('ensure_teacher_learning_groups').then(result=>{
    if(result.error) throw result.error;
    return result.data;
  }).catch(error=>{pending=null;throw error;});
  return pending;
}
