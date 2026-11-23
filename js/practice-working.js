// Keep authored reasoning for word problems. For a direct arithmetic question,
// show the equation and an intermediate step using its actual operands.
function practiceWorking(prompt, answer, reason = '') {
  const match = prompt.match(/^(?:what is\s+)?(\d+)\s*([+×÷−-])\s*(\d+)(?:\s*=)?\s*\??\s*$/i);
  if (!match) return reason;
  const left = Number(match[1]), right = Number(match[3]), op = match[2];
  const value = {'+': left + right, '−': left - right, '-': left - right,
    '×': left * right, '÷': left / right}[op];
  if (!Number.isSafeInteger(value) || String(value) !== String(answer)) return reason;
  const equation = left+' '+op+' '+right+' = '+answer+'.';
  if (op === '÷') return equation+' Check by multiplying: '+answer+' × '+right+' = '+left+'.';
  if (op === '×' && right > 1) return 'Start with '+(right-1)+' groups: '+left+' × '+(right-1)+' = '+(value-left)+'. Add one more group: '+(value-left)+' + '+left+' = '+value+'.';
  if (right > 1 && op !== '×') {
    const step = right >= 11 && right % 10 ? right - right % 10 : right - 1;
    const intermediate = op === '+' ? left + step : left - step;
    return 'Split '+right+' into '+step+' + '+(right-step)+'. '+left+' '+op+' '+step+' = '+intermediate+'. Then '+intermediate+' '+op+' '+(right-step)+' = '+value+'.';
  }
  return equation+' '+reason;
}
