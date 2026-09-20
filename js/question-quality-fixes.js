(() => {
  const unique = values => [...new Set((values || []).map(value => String(value)))];

  function numberToWords(value) {
    const ones = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const underThousand = number => {
      const parts = [];
      if (number >= 100) {
        parts.push(`${ones[Math.floor(number / 100)]} hundred`);
        number %= 100;
        if (number) parts.push('and');
      }
      if (number >= 20) {
        const remainder = number % 10;
        parts.push(remainder ? `${tens[Math.floor(number / 10)]}-${ones[remainder]}` : tens[Math.floor(number / 10)]);
      } else if (number) {
        parts.push(ones[number]);
      }
      return parts.join(' ');
    };

    const number = Math.max(0, Math.floor(Number(value)));
    if (number < 20) return ones[number];
    const parts = [];
    const millions = Math.floor(number / 1000000);
    const thousands = Math.floor((number % 1000000) / 1000);
    const remainder = number % 1000;
    if (millions) parts.push(`${underThousand(millions)} million`);
    if (thousands) parts.push(`${underThousand(thousands)} thousand`);
    if (remainder) parts.push(underThousand(remainder));
    return parts.join(' ');
  }

  function isUsable(question) {
    if (!question || !Array.isArray(question.choices)) return true;
    const choices = unique(question.choices);
    return choices.length === question.choices.length && choices.length >= 2 && choices.includes(String(question.answer));
  }

  function wrapBasic(api) {
    if (!api || typeof api.question !== 'function' || api.__qualityChecked) return;
    const original = api.question.bind(api);
    api.question = (...args) => {
      let question;
      for (let attempt = 0; attempt < 30; attempt++) {
        question = original(...args);
        if (isUsable(question)) return question;
      }
      return question;
    };
    api.__qualityChecked = true;
  }

  function wrapYear5(api) {
    if (!api || typeof api.question !== 'function' || api.__qualityChecked) return;
    const original = api.question.bind(api);
    api.question = (...args) => {
      let question;
      for (let attempt = 0; attempt < 40; attempt++) {
        question = original(...args);
        const text = String(question?.text || '');

        const wordForm = text.match(/word form of\s+([\d,]+)/i);
        if (wordForm) {
          const number = Number(wordForm[1].replace(/,/g, ''));
          const candidates = [number, number + 1000, Math.max(0, number - 1000), number + 10000]
            .map(numberToWords);
          question.answer = numberToWords(number);
          question.choices = unique(candidates).sort(() => Math.random() - .5);
          question.tip = 'Read the number in groups of millions, thousands and ones.';
        }

        const equalGroups = text.match(/^([\d,]+) books are packed equally into (\d+) boxes/i);
        if (equalGroups) {
          const total = Number(equalGroups[1].replace(/,/g, ''));
          const groups = Number(equalGroups[2]);
          if (total % groups !== 0) continue;
        }

        if (/How much remains/i.test(text) && /^\$-/.test(String(question.answer))) continue;
        if (isUsable(question)) return question;
      }
      return question;
    };
    api.__qualityChecked = true;
  }

  wrapBasic(window.TY_YEAR1);
  wrapBasic(window.TY_YEAR4);
  wrapYear5(window.TY_YEAR5_TESTS);
})();
