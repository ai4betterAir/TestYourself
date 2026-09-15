/* Published loader: keeps the live Grade 4 library in sync with the complete data on main. */
fetch('https://raw.githubusercontent.com/ai4betterAir/TestYourself/main/js/vocabulary-y4-complete.js')
  .then(r=>{if(!r.ok) throw new Error('Vocabulary data could not be loaded'); return r.text();})
  .then(code=>(0,eval)(code))
  .catch(()=>{const q=document.getElementById('quizQ');if(q)q.textContent='Vocabulary is temporarily unavailable. Please refresh the page.';});
