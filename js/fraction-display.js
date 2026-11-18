/* Presentation only: textContent and stored answer strings remain "1/2". */
(() => {
  const style = document.createElement('style');
  style.textContent = `
    .stacked-fraction{display:inline-grid;grid-template-rows:auto auto;vertical-align:middle;text-align:center;line-height:1.1;margin:0 .12em;font-variant-numeric:tabular-nums;white-space:nowrap}
    .stacked-fraction>span:first-child{border-bottom:1px solid currentColor;padding:0 .16em .12em}
    .stacked-fraction>span:last-child{padding:.12em .16em 0}
    .stacked-fraction>.fraction-slash{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
  `;
  document.head.append(style);
  const excluded = 'script,style,textarea,input,select,option,code,pre,svg,math,nav,time,[contenteditable],.stacked-fraction,.stats,.stat,.session-summary,.practice-dialog-score,.practice-dialog-progress,#mockMark,#mockBreakdown,[data-fraction-display="off"]';
  const fraction = /(?<![\w/.])(-?\d+)\/(\d+)(?![\w/]|\.\d)/g;
  function render(node) {
    if (!node.parentElement || node.parentElement.closest(excluded)) return;
    const source = node.nodeValue;
    if (!source.includes('/') || /https?:|www\.|\b\d{1,4}\/\d{1,2}\/\d{1,4}\b/.test(source)) return;
    // Scores and progress retain their familiar "12/20 correct" notation.
    const context = node.parentElement.textContent;
    if (/\b(score|correct|answered|complete|question)\s*[:=]?\s*\d+\s*\/\s*\d+|\d+\s*\/\s*\d+\s*(correct|answered|complete|points)\b/i.test(context)) return;
    fraction.lastIndex = 0;
    const matches = [...source.matchAll(fraction)].filter(match => Number(match[2]) !== 0);
    if (!matches.length) return;
    const fragment = document.createDocumentFragment();
    let end = 0;
    for (const match of matches) {
      fragment.append(source.slice(end, match.index));
      const wrapper = document.createElement('span');
      wrapper.className = 'stacked-fraction';
      for (const value of [match[1], '/', match[2]]) {
        const part = document.createElement('span');
        part.textContent = value;
        if (value === '/') part.className = 'fraction-slash';
        wrapper.append(part);
      }
      fragment.append(wrapper);
      end = match.index + match[0].length;
    }
    fragment.append(source.slice(end));
    node.replaceWith(fragment);
  }
  function scan(root) {
    if (root.nodeType === Node.TEXT_NODE) return render(root);
    if (root.nodeType !== Node.ELEMENT_NODE || root.matches(excluded)) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(render);
  }
  scan(document.body);
  new MutationObserver(records => {
    for (const record of records) {
      if (record.type === 'characterData') scan(record.target);
      else record.addedNodes.forEach(scan);
    }
  }).observe(document.body, {childList:true,subtree:true,characterData:true});
})();
