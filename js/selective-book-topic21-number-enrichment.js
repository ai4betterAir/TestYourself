// Topic 21: Selective Number Systems & Enrichment.
(function(){
  const mr=window.SKILLUP_MR_EXTRA;if(!mr)return;
  const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a,pick=a=>a[R(0,a.length-1)],shuffle=a=>[...a].sort(()=>Math.random()-.5),uniq=a=>[...new Set(a.map(String))];
  function Q(text,answer,choices,tip){const ans=String(answer);let rest=uniq(choices.map(String)).filter(x=>x!==ans);rest=shuffle(rest).slice(0,3);let k=1;while(rest.length<3){const v=String(k++);if(v!==ans&&!rest.includes(v))rest.push(v);}return{text,answer:ans,choices:shuffle([ans,...rest]),tip,topic:'sel_number_enrichment',name:'Number Systems & Enrichment'};}
  const romanMap=[['M',1000],['CM',900],['D',500],['CD',400],['C',100],['XC',90],['L',50],['XL',40],['X',10],['IX',9],['V',5],['IV',4],['I',1]];
  function toRoman(n){let s='';for(const [r,v] of romanMap){while(n>=v){s+=r;n-=v;}}return s;}
  const tri=n=>n*(n+1)/2;
  function row(n){let a=[1];for(let k=1;k<=n;k++)a.push(Math.round(a[k-1]*(n-k+1)/k));return a;}
  function question(){const m=R(0,14);let n,a,b,ans,r;
    if(m===0){n=R(1500,3999);ans=toRoman(n);return Q(`Which Roman numeral represents ${n}?`,ans,[ans,toRoman(n-1),toRoman(n+9),toRoman(Math.max(1,n-100))],'Break the number into thousands, hundreds, tens and ones.');}
    if(m===1){n=pick([49,94,444,944,1994,2026]);const rr=toRoman(n);return Q(`${rr} is equal to which standard number?`,n,[n,n+10,n-10,n+100],'Watch for subtractive pairs such as IV, IX, XL, XC, CD and CM.');}
    if(m===2){const c=pick([1.2,2.4,3.75,4.8,6.25,8.1]),e=R(4,7);const std=c*10**e;ans=std.toLocaleString('en-AU',{maximumFractionDigits:0});return Q(`Which standard number equals ${c} × 10^${e}?`,ans,[ans,(std/10).toLocaleString('en-AU'),(std*10).toLocaleString('en-AU'),String(c+e)],'The exponent tells how many places the decimal shifts for a power of ten.');}
    if(m===3){n=pick([54000,672000,8100000,34500000,902000000]);const e=Math.floor(Math.log10(n)),c=Number((n/10**e).toFixed(3));ans=`${c} × 10^${e}`;return Q(`Write ${n.toLocaleString()} in scientific notation.`,ans,[ans,`${c*10} × 10^${e-1}`,`${c} × 10^${e-1}`,`${c/10} × 10^${e}`],'The first factor must be at least 1 and less than 10.');}
    if(m===4){n=R(6,15);ans=n*n;return Q(`The ${n}th square number is?`,ans,[ans,tri(n),n*2,(n-1)*(n-1)],'Square numbers form n by n arrays.');}
    if(m===5){n=R(6,15);ans=tri(n);return Q(`A triangular pattern has ${n} rows of dots. How many dots are in the complete triangular number?`,ans,[ans,n*n,tri(n-1),tri(n+1)],'Build the total by adding 1 + 2 + ... + n.');}
    if(m===6){n=R(4,8);ans=tri(n+1)-tri(n);return Q(`The ${n}th triangular number is ${tri(n)}. How much larger is the next triangular number?`,ans,[ans,n,n+2,2*n],'Each new triangular number adds the next whole number.');}
    if(m===7){n=R(3,7);r=row(n);const k=R(1,r.length-2);ans=r[k];return Q(`Row ${n} of Pascal's Triangle is ${r.map((v,i)=>i===k?'?':v).join(', ')}. Find the missing value.`,ans,[ans,ans+1,ans-1,r[k-1]+r[k+1]],'Each interior entry is the sum of the two entries above it.');}
    if(m===8){n=R(3,8);r=row(n);ans=r.reduce((x,y)=>x+y,0);return Q(`The entries in row ${n} of Pascal's Triangle are ${r.join(', ')}. What is their sum?`,ans,[ans,ans/2,ans+n,ans-r[1]],'Add the row carefully; the row sums make their own pattern.');}
    if(m===9){n=R(3,8);ans=n+1;return Q(`If row 0 of Pascal's Triangle has 1 entry, how many entries are in row ${n}?`,ans,[ans,n,n+2,2*n],'Each new row has one more entry than the previous row.');}
    if(m===10){a=R(2,10);b=R(2,10);ans=a+b;return Q(`Two adjacent Pascal values are ${a} and ${b}. What value lies directly below them between their positions?`,ans,[ans,a*b,Math.abs(a-b),a+b+1],'Interior values are formed by addition.');}
    if(m===11){const vals=[36,45,49,55,64,66,81];n=pick(vals);const sq=Number.isInteger(Math.sqrt(n)),tr=[1,3,6,10,15,21,28,36,45,55,66,78].includes(n);ans=sq&&tr?'both square and triangular':sq?'square only':tr?'triangular only':'neither';return Q(`Classify ${n}.`,ans,[ans,'square only','triangular only','neither'],'Check the square-number and triangular-number patterns separately.');}
    if(m===12){const y=pick([1984,1999,2008,2024,2026]);ans=toRoman(y);return Q(`A monument is dated ${y}. Which Roman numeral is correct?`,ans,[ans,toRoman(y-1),toRoman(y+1),toRoman(y-10)],'Convert each place value using standard Roman numeral groups.');}
    if(m===13){const e1=R(4,7),e2=e1-1,c1=pick([2,3,4]),c2=pick([5,6,7,8,9]);const v1=c1*10**e1,v2=c2*10**e2;ans=v1>v2?'first':'second';return Q(`Which is greater: ${c1} × 10^${e1} or ${c2} × 10^${e2}?`,ans,[ans,ans==='first'?'second':'first','equal','cannot tell'],'Compare place value by rewriting both with the same power of ten or in standard form.');}
    n=R(3,7);r=row(n);const firstTwo=r[0]+r[1];ans=firstTwo;return Q(`In row ${n} of Pascal's Triangle, what is the sum of the first two entries?`,ans,[ans,n,n+2,2*n],'This question uses the pattern formed by the first two entries in each row.');
  }
  mr.topics=mr.topics.filter(x=>x[0]!=='sel_number_enrichment');
  const i=mr.topics.findIndex(x=>x[0]==='sel_exponents_order');
  mr.topics.splice(i>=0?i+1:mr.topics.length,0,['sel_number_enrichment','∞','Number Systems & Enrichment','Roman numerals, scientific notation, number patterns and Pascal’s Triangle']);
  const old=mr.question.bind(mr);mr.question=id=>id==='sel_number_enrichment'?question():old(id);
})();