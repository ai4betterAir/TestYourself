// Topic 28: Selective Fractions to Decimals.
(function(){
  const mr=window.SKILLUP_MR_EXTRA;if(!mr)return;
  const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a,pick=a=>a[R(0,a.length-1)],shuffle=a=>[...a].sort(()=>Math.random()-.5);
  const uniq=a=>[...new Set(a.map(String))];
  function Q(text,answer,choices,tip){const ans=String(answer);let rest=uniq(choices.map(String)).filter(x=>x!==ans);rest=shuffle(rest).slice(0,3);while(rest.length<3)rest.push(String((rest.length+1)/10));return{text,answer:ans,choices:shuffle([ans,...rest]),tip,topic:'sel_fractions_decimals',name:'Fractions to Decimals'};}
  const term=[['7/8','0.875'],['7/40','0.175'],['49/50','0.98'],['6/25','0.24'],['3/8','0.375'],['5/8','0.625']];
  const rep=[['1/3','0.333…'],['2/3','0.666…'],['1/9','0.111…'],['3/11','0.2727…'],['4/11','0.3636…'],['5/11','0.4545…']];
  function question(){const m=R(0,11);let p,ans;
    if(m===0){p=pick(term);return Q('Which decimal is equivalent to '+p[0]+'?',p[1],[p[1],String(Number(p[1])+0.1),String(Math.max(0,Number(p[1])-0.1)),'0.5'],'Use numerator ÷ denominator.');}
    if(m===1){p=pick(rep);return Q('Which decimal is equivalent to '+p[0]+'?',p[1],[p[1],p[1].replace('…',''),'0.25','0.5'],'Look for the repeating quotient.');}
    if(m===2){p=pick(rep);return Q('Which statement about '+p[0]+' is correct?','Its decimal repeats.',['Its decimal repeats.','Its decimal terminates.','It is greater than 1.','It cannot be written as a decimal.'],'Divide numerator by denominator and watch the remainder pattern.');}
    if(m===3){p=pick(term);return Q('Which statement about '+p[0]+' is correct?','Its decimal terminates.',['Its decimal terminates.','Its decimal repeats forever.','It equals 1.','It has no decimal form.'],'A remainder of 0 gives a terminating decimal.');}
    if(m===4)return Q('A student writes 3/8 = 0.38. What is the exact decimal?','0.375',['0.375','0.38','0.35','0.305'],'Do not round unless the question asks you to. Use 3 ÷ 8.');
    if(m===5)return Q('A student divides 3 by 11 and gets 0.272727…. Which block repeats?','27',['27','72','11','3'],'Identify the shortest repeating block.');
    if(m===6)return Q('Which pair names the same number?','7/20 and 0.35',['7/20 and 0.35','7/20 and 0.7','3/8 and 0.38','2/3 and 0.62'],'Convert the fraction exactly.');
    if(m===7)return Q('Which value is greatest?','7/8',['7/8','0.8','3/4','0.7'],'Rename the fraction: 7/8 = 0.875.');
    if(m===8)return Q('Which fraction gives a repeating decimal shown as 0.4545…?','5/11',['5/11','5/8','9/20','1/4'],'Use the repeating-decimal patterns from division.');
    if(m===9)return Q('Why is using an equivalent denominator of 100 helpful?','Hundredths can be written directly as a decimal',['Hundredths can be written directly as a decimal','It makes every fraction equal to 1','It removes the numerator','It guarantees a repeating decimal'],'A denominator that is a power of 10 maps directly to decimal places.');
    if(m===10)return Q('What is the exact relationship between a fraction bar and division?','a/b means a ÷ b',['a/b means a ÷ b','a/b means a × b','a/b means b ÷ a','a/b means a + b'],'The numerator is divided by the denominator.');
    return Q('If long division begins repeating the same remainder pattern, what should you expect?','A repeating decimal',['A repeating decimal','A terminating decimal immediately','A whole number only','No quotient'],'Repeating remainders create repeating digits.');
  }
  mr.topics=mr.topics.filter(x=>x[0]!=='sel_fractions_decimals');
  const i=mr.topics.findIndex(x=>x[0]==='sel_unit_fractions');
  mr.topics.splice(i>=0?i+1:mr.topics.length,0,['sel_fractions_decimals','0.5','Fractions to Decimals','Terminating and repeating decimals, exact conversion and equivalence reasoning']);
  const old=mr.question.bind(mr);mr.question=id=>id==='sel_fractions_decimals'?question():old(id);
})();