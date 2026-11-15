window.KINDY_MATHS = (() => {
  const topics = [
    ['counting','123','Counting','Count each object once'],
    ['number-order','↗','Number Order','Find a missing number'],
    ['simple-addition','+','Simple Addition','Join two groups'],
    ['shapes','△','Shapes','Look at sides and corners'],
    ['patterns','●','Patterns','Continue a repeating pattern'],
    ['measurement','↔','Measurement','Compare length using equal units']
  ];
  const pick = list => list[Math.floor(Math.random() * list.length)];
  function question(id) {
    const n = Math.floor(Math.random() * 6) + 2;
    let text, answer, options, tip;
    if (id === 'counting') {
      text = 'How many dots?  ' + Array(n).fill('●').join('  ');
      answer = n;
      tip = 'Point to each dot once as you count.';
    } else if (id === 'number-order') {
      text = 'Which number is missing?  ' + (n-2) + ', ' + (n-1) + ', □, ' + (n+1);
      answer = n;
      tip = 'Count on by one from the first number.';
    } else if (id === 'simple-addition') {
      const a = Math.floor(Math.random() * (n-1)) + 1;
      text = a + ' + ' + (n-a) + ' = ?';
      answer = n;
      tip = 'Count the first group, then count on for the second group.';
    } else if (id === 'measurement') {
      text = 'Two ribbons start at the same line. One is ' + n + ' blocks long. The other is ' + (n+2) + ' blocks long. How many blocks long is the longer ribbon?';
      answer = n+2;
      options = [n,n+1,n+2];
      tip = 'When the blocks are the same size, the longer ribbon covers more blocks.';
    } else if (id === 'shapes') {
      const [symbol,name] = pick([['○','Circle'],['△','Triangle'],['□','Square'],['▭','Rectangle']]);
      text = 'What shape is this?  ' + symbol;
      answer = name;
      options = ['Circle','Triangle','Square','Rectangle'];
      tip = 'Look at its outline, sides and corners.';
    } else {
      const [a,b] = pick([['red','blue'],['blue','yellow'],['yellow','green'],['green','red']]);
      const sequence = pick([[a,b,a,b,a],[a,a,b,a,a],[b,a,b,a,b]]);
      answer = sequence[0] === b ? a : b;
      text = 'Which colour comes next?  ' + sequence.join(', ') + ', □';
      options = [a,b,pick(['red','blue','green','yellow'].filter(x => x!==a && x!==b))];
      tip = 'Say the colours aloud and listen for the part that repeats.';
    }
    const choices = (options || [n-1,n,n+1]).map(String);
    for (let i=choices.length-1;i>0;i--) {
      const j=Math.floor(Math.random()*(i+1));
      [choices[i],choices[j]]=[choices[j],choices[i]];
    }
    return {text,answer:String(answer),choices,tip};
  }
  return {topics, question, has: id => topics.some(entry => entry[0]===id)};
})();
