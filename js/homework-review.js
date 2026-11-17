// Read-only submitted results; revision attempts never change assignment scores.
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function renderHomeworkReview(host,work,result,{filter='all',preview=false}={}) {
 const questions=result.questions;
 const mistakes=questions.filter(q=>!q.is_correct).length;
 const shown=questions.filter(q=>filter!=='mistakes'||!q.is_correct);
 host.innerHTML=`${preview?'<p class="homework-notice">Sample result preview · No student account or saved scores are used.</p>':''}<div class="homework-review-hero"><div><span class="homework-eyebrow">ASSIGNMENT COMPLETE</span><h1>${esc(work.title)}</h1><p>Your work is saved. Let’s learn from each answer.</p></div><div class="homework-review-score">${Number(result.score)}<span> / ${Number(result.total)}</span><small>${Math.round(Number(result.score)/Number(result.total)*100)}% correct</small></div></div><div class="homework-review-summary"><span>✓ ${questions.length-mistakes} correct</span><span>↻ ${mistakes} to review</span><span>Revision does not change your saved score</span></div><div class="homework-actions"><a class="primary-button" href="dashboard.html">Back to assignments</a><a class="secondary-button" href="leaderboard.html">View leaderboard</a></div><div class="homework-review-heading"><div><h2>Your question review</h2><p>Compare your answer, read the strategy and practise any question again.</p></div><div class="homework-review-filters" role="group" aria-label="Review filter"><button type="button" data-review-filter="all" aria-pressed="${filter==='all'}">All questions (${questions.length})</button><button type="button" data-review-filter="mistakes" aria-pressed="${filter==='mistakes'}">Review mistakes (${mistakes})</button></div></div><div class="homework-review-list">${shown.map(q=>{
  return `<article class="homework-review-item ${q.is_correct?'correct':'incorrect'}"><div class="homework-review-item-heading"><span>Question ${Number(q.number)}${q.topic?' · '+esc(q.topic):''}</span><strong>${q.is_correct?'✓ Correct':'↻ Let’s review'}</strong></div>${q.passage?`<details class="homework-review-passage"><summary>Read the passage</summary><p>${esc(q.passage)}</p></details>`:''}<h3>${esc(q.text)}</h3><div class="homework-review-options">${q.choices.map((choice,i)=>`<div class="${i===q.correct_index?'is-correct-answer':i===q.chosen_index?'is-wrong-answer':''}"><span>${esc(choice)}</span>${i===q.correct_index?`<small>✓ Correct answer${i===q.chosen_index?' · Your answer':''}</small>`:i===q.chosen_index?'<small>Your answer</small>':''}</div>`).join('')}</div><div class="homework-review-explanation"><strong>${q.explanation?'A strategy to use':'Your next step'}</strong><p>${q.explanation?esc(q.explanation):'The correct answer is '+esc(q.choices[q.correct_index])+'. Compare it with your choice, revisit the lesson, or ask your teacher to explain the steps.'}</p></div><button type="button" class="secondary-button" data-retry-question="${Number(q.number)}">Try this question again</button><div class="homework-review-retry" data-retry-box="${Number(q.number)}" hidden></div></article>`;
 }).join('')||'<div class="homework-review-perfect"><h3>No mistakes to review — well done!</h3><p>You can still revisit any question in All questions.</p></div>'}</div>`;
 host.querySelectorAll('[data-review-filter]').forEach(button=>button.onclick=()=>renderHomeworkReview(host,work,result,{filter:button.dataset.reviewFilter,preview}));
 host.querySelectorAll('[data-retry-question]').forEach(button=>button.onclick=()=>{
  const q=questions.find(q=>q.number===Number(button.dataset.retryQuestion)),box=button.nextElementSibling;
  const article=button.closest('article');
  const retrying=box.hidden;
  box.hidden=!retrying;
  article.querySelector('.homework-review-options').hidden=retrying;
  article.querySelector('.homework-review-explanation').hidden=retrying;
  button.textContent=retrying?'Back to my saved answer':'Try this question again';
  if(!retrying)return;
  box.innerHTML=`<p>Revision only · Take another look without changing your submitted result.</p><fieldset><legend>Choose your answer</legend>${q.choices.map((choice,i)=>`<label class="homework-answer"><input type="radio" name="retry-${q.number}" value="${i}"><span>${esc(choice)}</span></label>`).join('')}</fieldset><button type="button" class="primary-button" data-check-retry>Check revision answer</button><p data-retry-message role="status" aria-live="polite"></p>`;
  box.querySelector('[data-check-retry]').onclick=()=>{
   const choice=box.querySelector('input:checked'),message=box.querySelector('[data-retry-message]');
   if(!choice){message.textContent='Choose an answer first.';return;}
   const correct=Number(choice.value)===q.correct_index;
   message.className=correct?'revision-correct':'revision-try-again';
   message.textContent=correct?'Correct — well done. '+(q.explanation||'You have found the right answer.'):'Try again. '+(q.explanation||'Re-read the question and compare the choices carefully.');
  };
 });
}
export function sampleHomeworkReview() {
 const questions=Array.from({length:10},(_,i)=>{const a=29+i*3,b=4+i,correct=a+b;return {number:i+1,text:`${a} + ${b} = ?`,choices:[String(correct),String(correct-1),String(correct+2),String(correct+10)],chosen_index:i===1||i===4?1:0,correct_index:0,is_correct:i!==1&&i!==4,explanation:`Split ${b} into tens and ones. Add them to ${a} in steps, then check that your total is ${correct}.`,topic:'Addition and subtraction',passage:''};});
 return {score:8,total:10,questions};
}
